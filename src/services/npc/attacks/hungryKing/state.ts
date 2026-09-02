export type HungryKingAI = {
  knownPhase: number;
  hasSummoned: boolean;
  jumpState: "idle" | "jumping" | "inJump" | "jumpAttack";
  jumpStartTime: number;
  jumpTargetX: number;
  lastJump: number;
  landingTime: number;
  summonEndTime: number;
  lastSpriteState?: string;
};

import { JUMP_COOLDOWN } from "@/data/cooldowns";
import {
  FOUR_HUNDRED_MS,
  FIVE_HUNDRED_MS,
  SIX_HUNDRED_MS,
  ONE_THOUSAND_FIVE_HUNDRED_MS,
} from "@/data/ms";

export { JUMP_COOLDOWN };
export const MELEE_RANGE = 40;
export const JUMP_DURATION = ONE_THOUSAND_FIVE_HUNDRED_MS;
export const JUMP_THRESHOLD = 200;
export const JUMP_HEIGHT = 220;
export const JUMP_RISE_MS = FOUR_HUNDRED_MS;
export const JUMP_FLIGHT_MS = SIX_HUNDRED_MS;
export const JUMP_RECOVERY_MS = FIVE_HUNDRED_MS;

export function initHungryKingAi(phase: number): HungryKingAI {
  const now = Date.now();
  return {
    knownPhase: phase,
    hasSummoned: false,
    jumpState: "idle",
    jumpStartTime: now,
    jumpTargetX: 0,
    lastJump: 0,
    landingTime: now,
    summonEndTime: 0,
  };
}

export function handlePhaseChange(ai: HungryKingAI, newPhase: number) {
  ai.knownPhase = newPhase;
  ai.hasSummoned = false;
  ai.jumpState = "idle";
}
