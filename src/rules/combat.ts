import type { DirectionBattle } from "@/utils/types/player/player";
import { isPlayerInRange } from "@/rules/range";
import { isFacingTarget } from "@/rules/direction";

export function canPlayerHit(params: {
  playerX: number;
  playerY: number;
  npcX: number;
  npcY: number;
  playerState: string;
  character: string;
  direction: DirectionBattle;
}) {
  return (
    isPlayerInRange(
      params.playerX,
      params.playerY,
      params.npcX,
      params.npcY,
      params.playerState,
      params.character
    ) &&
    isFacingTarget(
      params.playerX,
      params.playerY,
      params.npcX,
      params.npcY,
      params.direction
    )
  );
}