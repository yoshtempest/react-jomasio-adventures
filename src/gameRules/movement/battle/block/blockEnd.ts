import { ALL_PREDICATES } from "@/gameRules/battle/playerStates";
import { isInBattle } from "@/gameRules/movement/battle/isInBattle";

export function blockEnd(p: Player): Player {
  if (!isInBattle(p)) return p;
  if (!ALL_PREDICATES.hasHorizontalControl(p.state)) return p;

  return {
    ...p,
    state: "idle",
  };
}
