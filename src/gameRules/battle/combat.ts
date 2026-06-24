import { isPlayerInRange } from "@/gameRules/battle/range";
import { isFacingTarget } from "@/gameRules/battle/direction";

const CROUCHED_STATES = new Set(["idleCrounched", "walkCrounched"]);

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
  if (CROUCHED_STATES.has(params.playerState)) return false;

  return (
    isPlayerInRange(
      params.playerX,
      params.playerY,
      params.npcX,
      params.npcY,
      params.playerState,
      params.character,
      params.isSpecial,
    ) &&
    isFacingTarget(
      params.playerX,
      params.playerY,
      params.npcX,
      params.npcY,
      params.direction,
    )
  );
}
