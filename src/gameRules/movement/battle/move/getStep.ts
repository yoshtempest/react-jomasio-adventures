import { ALL_STATES } from "@/gameRules/battle/playerStates";
import { isPlayerParalyzed } from "@/gameRules/battle/status/statusEffects";
import { BATTLE_STEP } from "../../constants";

const CROUCHED_STEP = 4;

export function getStep(player: Player): number {
  const base = ALL_STATES.CROUCHED_STATES.has(player.state) ? CROUCHED_STEP : BATTLE_STEP;
  const speed = isPlayerParalyzed(player) ? Math.round(base / 2) : base;
  return Math.round(speed * player.movementSpeed);
}