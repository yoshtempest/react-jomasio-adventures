export type MauraoAI = {
  knownPhase: number;
  dashState: "idle" | "windUp" | "dashing" | "postDash";
  dashStart: number;
  dashStartX: number;
  dashTargetX: number;
  dashHitDone: boolean;
  lastMeleeAttack: number;
  postDashStart: number;
  throwState: "idle" | "startThrow" | "throwing" | "throwed";
  throwStart: number;
  lastRangedAttack: number;
  spinState: "idle" | "spinning" | "resting";
  spinStart: number;
  spinRestStart: number;
  lastSpinHit: number;
  spinHitCount: number;
};

export const MELEE_RANGE = 50;

export const DASH_RANGE = 60;
export const DASH_DURATION = 400;
export const DASH_EXTRA = 120;
export const WIND_UP_DURATION = 200;
export const POST_DASH_IDLE = 250;

export const THROW_RANGE = 120;
export const THROW_WIND_UP = 200;
export const THROW_ACTIVE = 150;
export const THROW_FOLLOW_THROUGH = 200;

export const SPIN_DURATION = 8000;
export const SPIN_CYCLE_DURATION = 1000;
export const SPIN_HIT_INTERVAL = 333;
export const SPIN_MELEE_RANGE = 50;
export const SPIN_REST_DURATION = 5000;
export const SPIN_MOVE_SPEED = 2;
export const SPIN_CYCLE_START_THRESHOLD = 333;
export const SPIN_CYCLE_END_THRESHOLD = 333;

export function initMauraoAi(npcPhase: number): MauraoAI {
  return {
    knownPhase: npcPhase,
    dashState: "idle",
    dashStart: 0,
    dashStartX: 0,
    dashTargetX: 0,
    dashHitDone: false,
    lastMeleeAttack: 0,
    postDashStart: 0,
    throwState: "idle",
    throwStart: 0,
    lastRangedAttack: 0,
    spinState: "idle",
    spinStart: 0,
    spinRestStart: 0,
    lastSpinHit: 0,
    spinHitCount: 0,
  };
}

export function handlePhaseChange(ai: MauraoAI, npcPhase: number): void {
  ai.knownPhase = npcPhase;
  ai.dashState = "idle";
  ai.dashStart = 0;
  ai.dashHitDone = false;
  ai.lastMeleeAttack = 0;
  ai.throwState = "idle";
  ai.throwStart = 0;
  ai.lastRangedAttack = 0;
  ai.spinState = "idle";
  ai.spinStart = 0;
  ai.spinRestStart = 0;
  ai.lastSpinHit = 0;
  ai.spinHitCount = 0;
}
