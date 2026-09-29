import { isPlayerInRange } from "@/gameRules/battle/range";
import { isFacingTarget } from "@/gameRules/battle/direction";
import { ALL_PREDICATES } from "@/gameRules/battle/playerStates";

export function canPlayerHit(params: {
  playerX: number;
  playerY: number;
  npcX: number;
  npcY: number;
  playerState: PlayerState;
  character: string;
  direction: Direction;
  isSpecial: boolean;
  npcClass?: NPCClass;
  rangeOverride?: number;
}) {
  if (ALL_PREDICATES.isCrouched(params.playerState)) return false;

  return (
    isPlayerInRange(
      params.playerX,
      params.playerY,
      params.npcX,
      params.npcY,
      params.playerState,
      params.character,
      params.isSpecial,
      false,
      params.npcClass,
      params.rangeOverride,
    ) &&
    isFacingTarget(
      params.playerX,
      params.playerY,
      params.npcX,
      params.npcY,
      params.direction,
      params.npcClass ?? "common",
    )
  );
}
