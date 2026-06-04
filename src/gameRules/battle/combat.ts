import { isPlayerInRange } from "@/gameRules/battle/range";
import { isFacingTarget } from "@/gameRules/battle/direction";

export function canPlayerHit(params: {
  playerX: number;
  playerY: number;
  npcX: number;
  npcY: number;
  playerState: playerState;
  character: string;
  direction: Direction;
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