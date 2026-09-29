import { ALL_STATES } from "@/gameRules/battle/playerStates";

export function resolveMovementState(
  state: PlayerState,
  canRun: boolean,
): PlayerState {
  // Sono zerado: só andar — nunca evolui para preRun/run (run.svg).
  if (!canRun && ALL_STATES.MOVE_STATES.has(state)) return "walk";
  if (state === "jump") return "jump";
  if (ALL_STATES.MOVE_STATES.has(state)) return state;
  if (ALL_STATES.CROUCHED_STATES.has(state)) return "walkCrounched";
  if (state === "preJump") return "preJump";
  return "walk";
}