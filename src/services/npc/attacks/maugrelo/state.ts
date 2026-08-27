export type GroundPaper = {
  id: number;
  x: number;
  y: number;
  sprite: "paper" | "explosion";
  createdAt: number;
};

export type FlyingPaper = {
  x: number;
  y: number;
  velX: number;
  velY: number;
};

export type MaugreloAI = {
  actionState: "idle" | "preMove" | "action" | "postAction" | "meditating";
  actionStart: number;
  currentAction: "throw" | "slap" | "push" | null;
  lastThrow: number;
  lastSlap: number;
  lastPush: number;
  flyingPaper: FlyingPaper | null;
  groundPapers: GroundPaper[];
  paperIdCounter: number;
  lastPaperHitId: number;
  meditationArmorBonus: number;
  lastArmorBuff: number;
  walkingStartTime: number;
};

export const PRE_MOVE_DURATION = 300;
export const THROW_ACTIVE_DURATION = 200;
export const POST_ACTION_COOLDOWN = 300;

export const SLAP_RANGE = 50;
export const PUSH_RANGE = 120;
export const MELEE_SWITCH_DISTANCE = 100;

export const SLAP_COOLDOWN = 1200;
export const PUSH_COOLDOWN = 1500;
export const THROW_COOLDOWN = 5000;

export const MAX_GROUND_PAPERS = 3;
export const MEDITATION_ARMOR_INTERVAL = 3000;
export const RUN_TRANSITION_DELAY = 1500;

export const PAPER_GRAVITY = 0.35;
export const PAPER_INITIAL_VEL_X = -2.5;
export const PAPER_INITIAL_VEL_Y = -4;
export const PAPER_GROUND_Y = 535;
export const PAPER_GROUND_Y_SPREAD = 30;
export const PAPER_X_SPREAD = 60;
export const PAPER_VEL_X_SPREAD = 1.5;
export const PAPER_MIN_DISTANCE = 50;
export const PAPER_EXPLOSION_DURATION = 500;
export const PAPER_STEP_RADIUS = 30;
/**
 * Tolerância vertical (eixo Y) para o papel explodir quando o jogador pisa.
 * O jogador fica com os pés na mesma altura dos papéis no chão (dy baixo).
 * Ao pular por cima, os pés ficam bem acima dos papéis (dy alto), então
 * ficam acima deste limite e os papéis não explodem, continuando no chão.
 */
export const PAPER_STEP_VERTICAL_RANGE = 60;
export const PAPER_ATTACK_RANGE = 200;

export function initMaugreloAi(): MaugreloAI {
  return {
    actionState: "idle",
    actionStart: 0,
    currentAction: null,
    lastThrow: 0,
    lastSlap: 0,
    lastPush: 0,
    flyingPaper: null,
    groundPapers: [],
    paperIdCounter: 0,
    lastPaperHitId: 0,
    meditationArmorBonus: 0,
    lastArmorBuff: 0,
    walkingStartTime: 0,
  };
}
