import { isPlayerFrozen } from "@/gameRules/battle/status/statusEffects";
import { ALL_PREDICATES, ALL_STATES } from "@/gameRules/battle/playerStates";
import { isPlayerAttackHolding } from "@/gameRules/movement/battle/attack/isPlayerAttackHolding";
import { BATTLE_LIMITS, DASH_STEP } from "@/gameRules/movement/constants";
import { moveAxis } from "@/gameRules/movement/battle/move/axis";

export function dashLeftBattle(p: Player): Player {
  if (
    p.mode !== "battle" ||
    !ALL_PREDICATES.hasHorizontalControl(p.state) ||
    isPlayerFrozen(p) ||
    ALL_STATES.CROUCHED_STATES.has(p.state) ||
    isPlayerAttackHolding(p)
  ) {
    return p;
  }
  return moveAxis(p, "left", DASH_STEP, BATTLE_LIMITS.minX, { state: "dash" });
}
