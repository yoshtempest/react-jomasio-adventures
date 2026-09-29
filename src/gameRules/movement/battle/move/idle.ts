import { ALL_PREDICATES, ALL_STATES } from "@/gameRules/battle/playerStates";

export function idleBattle(p: Player): Player {
  if (ALL_PREDICATES.isIdleBlocked(p.state)) return p;

  if (ALL_STATES.CROUCHED_STATES.has(p.state)) {
    return { ...p, state: "idleCrounched" };
  }

  return {
    ...p,
    state: ALL_STATES.IDLE_PRESERVED_STATES.has(p.state) ? p.state : "idle",
  };
}
