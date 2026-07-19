import { useMemo } from "react";
import { getTileInFront } from "@/utils/getTileInFront";

type Player = {
  gridX: number;
  gridY: number;
  direction: Direction;
};

type MapData = number[][];

type Params = {
  player: Player;
  map: MapData;
  isReady: boolean;
  npcs: { gridX: number; gridY: number }[];
  itemPickupTiles?: { x: number; y: number; visible: boolean }[];
  plates: { gridX: number; gridY: number; message?: string }[];
  interactionKeys?: string[];
  tileDialogues?: Record<string, unknown>;
};

export function useSceneLayers({
  player,
  map,
  isReady,
  npcs,
  itemPickupTiles,
  plates,
  interactionKeys,
  tileDialogues,
}: Params) {
  const frontTile = useMemo(() => {
    if (!isReady) return null;
    return getTileInFront(player, map);
  }, [player, map, isReady]);

  const interactionHint = useMemo(() => {
    if (!frontTile) return null;

    const { x, y } = frontTile;

    const npc = npcs.find((n) => n.gridX === x && n.gridY === y);
    if (npc) return "[L] Conversar";

    const pickup = itemPickupTiles?.find(
      (t) => t.x === x && t.y === y && t.visible,
    );
    if (pickup) return "[L] Pegar";

    const plate = plates.find((p) => p.gridX === x && p.gridY === y);
    if (plate) return "[L] Interagir";

    if (interactionKeys?.includes(`${x},${y}`)) return "[L] Interagir";

    if (tileDialogues?.[`${x},${y}`]) return "[L] Interagir";

    return null;
  }, [frontTile, npcs, itemPickupTiles, plates, interactionKeys, tileDialogues]);

  return { frontTile, interactionHint };
}
