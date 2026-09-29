import { ALL_PREDICATES } from "@/gameRules/battle/playerStates";
import { isInBattle } from "../isInBattle";

export function blockStart(p: Player): Player {
  if (!isInBattle(p)) return p;
  if (!ALL_PREDICATES.hasHorizontalControl(p.state)) return p;

  return {
    ...p,
    state: "blocked",
  };
}