import { isPlayerFrozen } from "@/gameRules/battle/status/statusEffects";
import { isPlayerRestrained } from "@/gameRules/battle/playerStates";
import { ALL_STATES } from "@/gameRules/battle/playerStates";
import { isPlayerAttackHolding } from "@/gameRules/movement/battle/attack/isPlayerAttackHolding";

export function canAct(player: Player) {
  if (isPlayerFrozen(player)) return false;
  if (isPlayerRestrained(player)) return false;
  if (isPlayerAttackHolding(player)) return false;
  return (
    player.mode === "battle" && !ALL_STATES.CANNOT_ACT_STATES.has(player.state)
  );
}
