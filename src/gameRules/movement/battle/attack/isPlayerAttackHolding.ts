import { ALL_PREDICATES } from "@/gameRules/battle/playerStates";

/** Artur fica travado (sem mover/crouch/dash) enquanto segura o ataque (attack.svg). */
export function isPlayerAttackHolding(player: Player) {
  return player.character === "artur" && ALL_PREDICATES.isAttackPose(player.state);
}