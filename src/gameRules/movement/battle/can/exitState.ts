import { ALL_PREDICATES } from "@/gameRules/battle/playerStates";

export function canExitState(player: Player) {
  return ALL_PREDICATES.canStartSpecialFrom(player.state);
}
