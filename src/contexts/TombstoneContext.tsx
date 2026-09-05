import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { TOMBSTONES_KEY } from "@/data/storageKeys";
import {
  createTombstone,
  TOMBSTONE_FADE_MS,
} from "@/gameRules/tombstone/tombstone";
import { useCompressedStorage } from "@/hooks/useCompressedStorage";
import type {
  PendingTombstoneSpawn,
  Tombstone,
  TombstonesSaveData,
} from "@/utils/types/npc/tombstone";

type ContextType = {
  /** Guarda posição/direção do jogador no início de uma batalha de encontro. */
  prepareTombstoneSpawn: (pending: PendingTombstoneSpawn) => void;
  /** Descarta o pending quando o jogador volta sem vitória (fuga/derrota). */
  clearPendingTombstoneSpawn: () => void;
  /** Na morte do NPC: consome o pending e cria a lápide no tile em frente. */
  spawnVictoryTombstone: (npcType: string) => void;
  /** Ativas + em fade, separadas (render/colisão usam todas; interação só ativas). */
  getTombstones: (locationId: string) => {
    active: Tombstone[];
    fading: Tombstone[];
  };
  /** Marca como coletada: sai do save, fica em fade até poder ser pisada. */
  collectTombstone: (locationId: string, id: string) => boolean;
};

const TombstoneContext = createContext<ContextType | null>(null);

function isValidTombstone(value: unknown): value is Tombstone {
  if (!value || typeof value !== "object") return false;
  const t = value as Partial<Tombstone>;
  return (
    typeof t.id === "string" &&
    typeof t.locationId === "string" &&
    typeof t.x === "number" &&
    typeof t.y === "number" &&
    (t.variant === "front" || t.variant === "back" || t.variant === "side") &&
    typeof t.npcType === "string"
  );
}

function normalizeTombstones(data: TombstonesSaveData): TombstonesSaveData {
  const safe: TombstonesSaveData = {};
  for (const [locationId, entries] of Object.entries(data ?? {})) {
    if (!Array.isArray(entries)) continue;
    const valid = entries.filter(isValidTombstone);
    if (valid.length > 0) safe[locationId] = valid;
  }
  return safe;
}

export function TombstoneProvider({ children }: { children: ReactNode }) {
  const [tombsByLocation, setTombsByLocation] =
    useCompressedStorage<TombstonesSaveData>(
      TOMBSTONES_KEY,
      {},
      normalizeTombstones,
    );

  /** Lápides coletadas nesta sessão, ainda animando o fade-out. */
  const [fadingByLocation, setFadingByLocation] = useState<TombstonesSaveData>(
    {},
  );

  const pendingRef = useRef<PendingTombstoneSpawn | null>(null);
  const timersRef = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());

  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      timers.forEach((timer) => clearTimeout(timer));
      timers.clear();
    };
  }, []);

  const prepareTombstoneSpawn = useCallback(
    (pending: PendingTombstoneSpawn) => {
      pendingRef.current = pending;
    },
    [],
  );

  const clearPendingTombstoneSpawn = useCallback(() => {
    pendingRef.current = null;
  }, []);

  const spawnVictoryTombstone = useCallback(
    (npcType: string) => {
      const pending = pendingRef.current;
      if (!pending) return;
      pendingRef.current = null;

      const tombstone = createTombstone(pending.locationId, pending, npcType);
      if (!tombstone) return;

      // se já existe lápide no mesmo tile, a nova substitui a antiga
      setTombsByLocation((prev) => ({
        ...prev,
        [pending.locationId]: [
          ...(prev[pending.locationId] ?? []).filter(
            (entry) => entry.id !== tombstone.id,
          ),
          tombstone,
        ],
      }));
    },
    [setTombsByLocation],
  );

  const getTombstones = useCallback(
    (locationId: string) => ({
      active: tombsByLocation[locationId] ?? [],
      fading: fadingByLocation[locationId] ?? [],
    }),
    [tombsByLocation, fadingByLocation],
  );

  const collectTombstone = useCallback(
    (locationId: string, id: string): boolean => {
      const tombstone = tombsByLocation[locationId]?.find(
        (entry) => entry.id === id,
      );
      if (!tombstone) return false;

      setTombsByLocation((prev) => ({
        ...prev,
        [locationId]: (prev[locationId] ?? []).filter(
          (entry) => entry.id !== id,
        ),
      }));
      setFadingByLocation((prev) => ({
        ...prev,
        [locationId]: [...(prev[locationId] ?? []), tombstone],
      }));

      const timer = setTimeout(() => {
        timersRef.current.delete(timer);
        setFadingByLocation((prev) => ({
          ...prev,
          [locationId]: (prev[locationId] ?? []).filter(
            (entry) => entry.id !== id,
          ),
        }));
      }, TOMBSTONE_FADE_MS);
      timersRef.current.add(timer);

      return true;
    },
    [tombsByLocation, setTombsByLocation],
  );

  const value = useMemo(
    () => ({
      prepareTombstoneSpawn,
      clearPendingTombstoneSpawn,
      spawnVictoryTombstone,
      getTombstones,
      collectTombstone,
    }),
    [
      prepareTombstoneSpawn,
      clearPendingTombstoneSpawn,
      spawnVictoryTombstone,
      getTombstones,
      collectTombstone,
    ],
  );

  return (
    <TombstoneContext.Provider value={value}>
      {children}
    </TombstoneContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTombstones() {
  const ctx = useContext(TombstoneContext);
  if (!ctx) throw new Error("useTombstones precisa do TombstoneProvider");
  return ctx;
}
