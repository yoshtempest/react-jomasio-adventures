import { useEffect, useMemo } from "react";
import { useLocation } from "react-router";
import { useTransitionCtx } from "@/contexts/TransitionContext";
import { useTombstones } from "@/contexts/TombstoneContext";
import { useCompressedStorage } from "@/hooks/useCompressedStorage";
import { FOOTBALLCOURT_DOGS_KEY } from "@/data/storageKeys";
import { npcPath } from "@/utils/paths";
import type { SceneNPCData } from "@/utils/types/maps/exploreScene";

export const FOOTBALLCOURT_DOG_LOCATION_ID = "footballCourt";

/**
 * Cães mortos de fome do campo: NPCs fixos que levam direto à batalha.
 * Permanecem nos mesmos locais até serem derrotados; ao ganhar, uma lápide
 * nasce no tile do cão (detectada aqui via tombstones) e outro cão ocupa
 * um novo ponto aleatório livre.
 */
export const FOOTBALLCOURT_DOG_COUNT = 3;

const BATTLE_ROUTE = "/battle/hungryDog";
const DOG_LEVEL_RANGE: readonly [number, number] = [5, 8];

/** Pontos candidatos: tiles andáveis do mapa footballCourt/one, espalhados. */
const DOG_SPOTS: readonly { x: number; y: number }[] = [
  { x: 2, y: 4 },
  { x: 5, y: 4 },
  { x: 11, y: 4 },
  { x: 14, y: 4 },
  { x: 2, y: 6 },
  { x: 14, y: 6 },
  { x: 5, y: 8 },
  { x: 11, y: 8 },
  { x: 2, y: 10 },
  { x: 14, y: 10 },
];

type DogSpot = { x: number; y: number };

const NO_DOGS: DogSpot[] = [];

const tileKey = (spot: { x: number; y: number }) => `${spot.x},${spot.y}`;

function uniqueByTile(spots: DogSpot[]): DogSpot[] {
  const seen = new Set<string>();
  return spots.filter((spot) => {
    const key = tileKey(spot);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function normalizeDogSpots(data: DogSpot[]): DogSpot[] {
  if (!Array.isArray(data)) return NO_DOGS;
  return uniqueByTile(
    data.filter(
      (spot) =>
        spot &&
        typeof spot.x === "number" &&
        typeof spot.y === "number",
    ),
  );
}

function shuffle<T>(arr: readonly T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const placeholder = a[i]!;
    a[i] = a[j]!;
    a[j] = placeholder;
  }
  return a;
}

function reconcileSpots(
  saved: DogSpot[],
  tombstoneTiles: Set<string>,
): DogSpot[] {
  const freeOfTombstones = (spot: DogSpot) =>
    !tombstoneTiles.has(tileKey(spot));

  const kept = uniqueByTile(saved).filter(freeOfTombstones);
  const taken = new Set(kept.map(tileKey));
  const available = DOG_SPOTS.filter(
    (spot) => !tombstoneTiles.has(tileKey(spot)) && !taken.has(tileKey(spot)),
  );

  const need = FOOTBALLCOURT_DOG_COUNT - kept.length;
  const added = need > 0 ? shuffle(available).slice(0, need) : [];

  return [...kept, ...added];
}

function rollDogLevel(): number {
  const [min, max] = DOG_LEVEL_RANGE;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function useFootballCourtDogs() {
  const { getTombstones, prepareTombstoneSpawn } = useTombstones();
  const { navigateWithFade } = useTransitionCtx();
  const location = useLocation();

  const tombstoneTiles = useMemo(
    () =>
      new Set(
        getTombstones(FOOTBALLCOURT_DOG_LOCATION_ID).active.map(tileKey),
      ),
    [getTombstones],
  );

  const [rawSpots, setRawSpots] = useCompressedStorage<DogSpot[]>(
    FOOTBALLCOURT_DOGS_KEY,
    NO_DOGS,
    normalizeDogSpots,
  );

  const spots = useMemo(
    () => reconcileSpots(rawSpots, tombstoneTiles),
    [rawSpots, tombstoneTiles],
  );

  useEffect(() => {
    const same =
      spots.length === rawSpots.length &&
      spots.every((spot) =>
        rawSpots.some(
          (raw) => raw.x === spot.x && raw.y === spot.y,
        ),
      );
    if (same) return;
    setRawSpots(spots);
  }, [spots, rawSpots, setRawSpots]);

  const dogNpcs = useMemo<SceneNPCData[]>(
    () =>
      spots.map((spot) => ({
        gridX: spot.x,
        gridY: spot.y,
        src: npcPath("/hungryDog/default.svg"),
        interaction: () => {
          prepareTombstoneSpawn({
            x: spot.x,
            y: spot.y,
            locationId: FOOTBALLCOURT_DOG_LOCATION_ID,
          });
          navigateWithFade(BATTLE_ROUTE, {
            state: {
              battleOrigin: location.pathname,
              npcLevel: rollDogLevel(),
            },
          });
        },
      })),
    [spots, prepareTombstoneSpawn, navigateWithFade, location.pathname],
  );

  return { dogNpcs };
}