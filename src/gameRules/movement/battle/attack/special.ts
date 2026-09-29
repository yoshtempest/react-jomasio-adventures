import { canExitState } from "@/gameRules/movement/battle/can/exitState";

export function specialBattle(p: Player): Player {
  if (!canExitState(p)) return p;

  return {
    ...p,
    state: p.state === "jump" ? "jump" : "special",
  };
}
