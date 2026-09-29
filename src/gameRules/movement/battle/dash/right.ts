import { ALL_PREDICATES, ALL_STATES } from "@/gameRules/battle/playerStates";
import { isPlayerFrozen } from "@/gameRules/battle/status/statusEffects";
import { isPlayerAttackHolding } from "../attack/isPlayerAttackHolding";
import { moveAxis } from "../move/axis";
import { BATTLE_LIMITS, DASH_STEP } from "../../constants";

export function dashRightBattle(p: Player): Player {
  if (
    p.mode !== "battle" ||
    !ALL_PREDICATES.hasHorizontalControl(p.state) ||
    isPlayerFrozen(p) ||
    ALL_STATES.CROUCHED_STATES.has(p.state) ||
    isPlayerAttackHolding(p)
  ) {
    return p;
  }
  return moveAxis(p, "right", DASH_STEP, BATTLE_LIMITS.maxX, { state: "dash" });
}