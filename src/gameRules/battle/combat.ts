import type { DirectionBattle } from "@/utils/types/player/player";
import { isPlayerInRange } from "@/gameRules/battle/range";
import { isFacingTarget } from "@/gameRules/battle/direction";

export function canPlayerHit(params: {
  playerX: number;
  playerY: number;
  npcX: number;
  npcY: number;
  playerState: string;
  character: string;
  direction: DirectionBattle;
  isSpecial: boolean;
}) {
  return (
    isPlayerInRange(
      params.playerX,
      params.playerY,
      params.npcX,
      params.npcY,
      params.playerState,
      params.character,
      params.isSpecial
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