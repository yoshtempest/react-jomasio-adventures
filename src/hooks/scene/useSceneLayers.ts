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
  tombstones?: { x: number; y: number }[];
  groundLoots?: { x: number; y: number }[];
};

/**
 * Deriva o tile em frente ao jogador e o hint de interação daquele tile.
 *
 * A ordem dos testes espelha a cadeia de `onInteract` do ExploreScene
 * (npc → tileDialogue → lápide → placa): hint e ação precisam concordar,
 * senão o jogador lê um rótulo e recebe outra interação.
 *
 * `tombstones` deve conter só as lápides coletáveis — as que estão em
 * fade-out ainda bloqueiam o tile, mas não aceitam mais interação.
 */
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
  tombstones,
  groundLoots,
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

    if (tileDialogues?.[`${x},${y}`]) return "[L] Interagir";

    const tombstone = tombstones?.find((t) => t.x === x && t.y === y);
    if (tombstone) return "[L] Recolher";

    const groundLoot = groundLoots?.find((l) => l.x === x && l.y === y);
    if (groundLoot) return "[L] Interagir";

    const plate = plates.find((p) => p.gridX === x && p.gridY === y);
    if (plate) return "[L] Interagir";

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
    tombstones,
    groundLoots,
  ]);

  return { frontTile, interactionHint };
}
