import { isPositionInFront } from "@/utils/isPositionInFront";

type NpcLike = { gridX: number; gridY: number };

export function isNpcInFront(
  player: Pick<Player, "gridX" | "gridY" | "direction">,
  npc: NpcLike,
) {
  return isPositionInFront(player, npc.gridX, npc.gridY);
}
