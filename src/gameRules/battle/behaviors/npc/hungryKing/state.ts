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

export { JUMP_COOLDOWN };
export const JUMP_DURATION = 1500;
export const JUMP_THRESHOLD = 200;
export const JUMP_HEIGHT = 220;
export const JUMP_RISE_MS = 400;
export const JUMP_FLIGHT_MS = 600;
export const JUMP_RECOVERY_MS = 500;

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
