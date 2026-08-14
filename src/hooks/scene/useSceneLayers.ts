import { useMemo } from "react";
import { getTileInFront } from "@/utils/getTileInFront";
import { isNpcInFront } from "@/utils/isNpcInFront";
import { isPositionInFront, parseGridKey } from "@/utils/isPositionInFront";
import { canStepTo } from "@/gameRules/movement/levels";
import type { ItemPickupTile } from "@/utils/types/maps/exploreScene";

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
  itemPickupTiles?: ItemPickupTile[];
  plates: { gridX: number; gridY: number; message?: string }[];
  interactionKeys?: string[];
  interactionLabels?: Record<string, string>;
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
  interactionLabels,
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

    const hasInteractionKey = interactionKeys?.some((key) => {
      const pos = parseGridKey(key);
      return pos ? isPositionInFront(player, pos.x, pos.y) : false;
    });
    if (hasInteractionKey) {
      return interactionLabels?.[`${x},${y}`] ?? "[L] Interagir";
    }

    const pickup = itemPickupTiles?.find(
      (t) => t.visible && isPositionInFront(player, t.x, t.y),
    );
    if (pickup) return "[L] Pegar";

    const plate = plates.find((p) => p.gridX === x && p.gridY === y);
    if (plate) return "[L] Interagir";

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
    interactionLabels,
    tileDialogues,
  ]);

  return { frontTile, interactionHint };
}
