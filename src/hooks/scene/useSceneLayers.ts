import { useMemo } from "react";
import { getTileInFront } from "@/utils/getTileInFront";
import { isNpcInFront } from "@/utils/isNpcInFront";
import { canStepTo } from "@/gameRules/movement/levels";

type Player = {
  gridX: number;
  gridY: number;
  height: number;
  direction: Direction;
};

type MapData = number[][];

type Params = {
  player: Player;
  map: MapData;
  heightMap?: MapData;
  isReady: boolean;
  npcs: { gridX: number; gridY: number }[];
  itemPickupTiles?: { x: number; y: number; visible: boolean; height?: number }[];
  plates: { gridX: number; gridY: number; message?: string }[];
  interactionKeys?: string[];
  tileDialogues?: Record<string, unknown>;
};

export function useSceneLayers({
  player,
  map,
  heightMap,
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

    if (!canStepTo(player.height, heightMap, x, y)) return null;

    const npc = npcs.find((n) => isNpcInFront(player, n));
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
  }, [
    frontTile,
    player,
    heightMap,
    npcs,
    itemPickupTiles,
    plates,
    interactionKeys,
    tileDialogues,
  ]);

  return { frontTile, interactionHint };
}
