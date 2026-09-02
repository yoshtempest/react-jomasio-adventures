import {
  ONE_HUNDRED_FIFTY_MS,
  TWO_HUNDRED_MS,
  TWO_HUNDRED_FIFTY_MS,
  FOUR_HUNDRED_MS,
  THREE_HUNDRED_THIRTY_THREE_MS,
  ONE_THOUSAND_MS,
  FIVE_THOUSAND_MS,
  EIGHT_THOUSAND_MS,
} from "@/data/ms";

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
export const DASH_DURATION = FOUR_HUNDRED_MS;
export const DASH_EXTRA = 120;
export const WIND_UP_DURATION = TWO_HUNDRED_MS;
export const POST_DASH_IDLE = TWO_HUNDRED_FIFTY_MS;

export const THROW_RANGE = 120;
export const THROW_WIND_UP = TWO_HUNDRED_MS;
export const THROW_ACTIVE = ONE_HUNDRED_FIFTY_MS;
export const THROW_FOLLOW_THROUGH = TWO_HUNDRED_MS;

export const SPIN_DURATION = EIGHT_THOUSAND_MS;
export const SPIN_CYCLE_DURATION = ONE_THOUSAND_MS;
export const SPIN_HIT_INTERVAL = THREE_HUNDRED_THIRTY_THREE_MS;
export const SPIN_MELEE_RANGE = 50;
export const SPIN_REST_DURATION = FIVE_THOUSAND_MS;
export const SPIN_MOVE_SPEED = 2;
export const SPIN_CYCLE_START_THRESHOLD = THREE_HUNDRED_THIRTY_THREE_MS;
export const SPIN_CYCLE_END_THRESHOLD = THREE_HUNDRED_THIRTY_THREE_MS;

/**
 * Distância (px) atrás do jogador onde Maurão reaparece ao começar a girar.
 *
 * Fica além de SPIN_MELEE_RANGE para o teleport não acertar de graça: o
 * jogador ainda tem a janela do primeiro SPIN_HIT_INTERVAL para reagir.
 */
export const SPIN_TELEPORT_OFFSET = 70;

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
