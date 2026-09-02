import type { NewPlayerStatus } from "@/gameRules/battle/status/statusEffects";
import {
  FIFTY_MS,
  ONE_HUNDRED_MS,
  TWO_HUNDRED_MS,
  THREE_HUNDRED_MS,
  SIX_HUNDRED_MS,
  EIGHT_HUNDRED_MS,
  ONE_THOUSAND_TWO_HUNDRED_MS,
  ONE_THOUSAND_FIVE_HUNDRED_MS,
  THREE_THOUSAND_MS,
  FIVE_THOUSAND_MS,
  EIGHT_THOUSAND_MS,
  FIVE_HUNDRED_MS,
} from "@/data/ms";

export type GroundPaper = {
  id: number;
  x: number;
  y: number;
  sprite: "paper" | "explosion";
  createdAt: number;
};

export type StuckPaper = {
  id: number;
  stuckAt: number;
  /** Quando o papel começou a explodir (explosion.svg). undefined = ainda paper.svg. */
  explodeAt?: number;
};

/** Tempo que o papel grudado fica mostrando explosion.svg antes de sumir (fade-out). */
export const STUCK_EXPLOSION_DISAPPEAR_MS = 300;

export type FlyingPaper = {
  x: number;
  y: number;
  velX: number;
  velY: number;
};

export type OrbitPaper = {
  id: number;
  angle: number;
};

export type LaserBeam = {
  active: boolean;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  dirX: 1 | -1;
};

export type MaugreloAI = {
  knownPhase: number;
  actionState: "idle" | "preMove" | "action" | "postAction" | "meditating";
  actionStart: number;
  currentAction: "throw" | "slap" | "push" | null;
  meleeHitTriggered: boolean;
  lastThrow: number;
  lastSlap: number;
  lastPush: number;
  flyingPaper: FlyingPaper | null;
  groundPapers: GroundPaper[];
  landedPapers: GroundPaper[];
  stuckPapers: StuckPaper[];
  paperIdCounter: number;
  lastPaperHitId: number;
  meditationArmorBonus: number;
  lastArmorBuff: number;
  walkingStartTime: number;
  phase2State:
    | "rising"
    | "orbiting"
    | "descending"
    | "landing"
    | "preMove"
    | "laser"
    | "debuff"
    | "throwPapers"
    | "charging"
    | "push";
  riseStartY: number;
  orbitPapers: OrbitPaper[];
  lastPaperFire: number;
  phase2StageStart: number;
  laser: LaserBeam | null;
  lastLaserDamage: number;
  appliedDebuff: NewPlayerStatus | null;
  papersThrownCount: number;
  lastPaperThrow: number;
  pushHitTriggered: boolean;
};

export const PRE_MOVE_DURATION = THREE_HUNDRED_MS;
export const THROW_ACTIVE_DURATION = TWO_HUNDRED_MS;
export const SLAP_ACTIVE_DURATION = THREE_HUNDRED_MS;
export const PUSH_ACTIVE_DURATION = THREE_HUNDRED_MS;
export const POST_ACTION_COOLDOWN = THREE_HUNDRED_MS;

export const SLAP_RANGE = 50;
export const PUSH_RANGE = 120;
export const MELEE_SWITCH_DISTANCE = 100;

export const SLAP_COOLDOWN = ONE_THOUSAND_TWO_HUNDRED_MS;
export const PUSH_COOLDOWN = ONE_THOUSAND_FIVE_HUNDRED_MS;
export const THROW_COOLDOWN = FIVE_THOUSAND_MS;

export const MAX_GROUND_PAPERS = 3;
export const MEDITATION_ARMOR_INTERVAL = THREE_THOUSAND_MS;
export const RUN_TRANSITION_DELAY = ONE_THOUSAND_FIVE_HUNDRED_MS;

export const PAPER_GRAVITY = 0.35;
export const PAPER_INITIAL_VEL_X = -2.5;
export const PAPER_INITIAL_VEL_Y = -4;
export const PAPER_GROUND_Y = 535;
export const PAPER_GROUND_Y_SPREAD = 30;
export const PAPER_X_SPREAD = 60;
export const PAPER_VEL_X_SPREAD = 1.5;
export const PAPER_MIN_DISTANCE = 50;
export const PAPER_EXPLOSION_DURATION = FIVE_HUNDRED_MS;
export const PAPER_STEP_RADIUS = 30;
/**
 * Tolerância vertical (eixo Y) para o papel explodir quando o jogador pisa.
 * O jogador fica com os pés na mesma altura dos papéis no chão (dy baixo).
 * Ao pular por cima, os pés ficam bem acima dos papéis (dy alto), então
 * ficam acima deste limite e os papéis não explodem, continuando no chão.
 */
export const PAPER_STEP_VERTICAL_RANGE = 60;
export const PAPER_ATTACK_RANGE = 200;
export const STUCK_PAPER_DURATION = THREE_THOUSAND_MS;

export const PHASE2_RISE_DISTANCE = 300;
export const PHASE2_RISE_SPEED = 3;
export const ORBIT_RADIUS = 80;
export const ORBIT_Y_OFFSET = 100;
export const ORBIT_COUNT = 9;
export const ORBIT_FIRE_INTERVAL = FIVE_HUNDRED_MS;
export const PHASE2_DESCEND_SPEED = 5;
export const PHASE2_LANDING_DURATION = THREE_HUNDRED_MS;
export const PHASE2_PREMOVE_DURATION = ONE_HUNDRED_MS;
export const PHASE2_LASER_DURATION = EIGHT_THOUSAND_MS;
export const PHASE2_DEBUFF_DURATION = EIGHT_HUNDRED_MS;
export const PHASE2_THROW_PAPER_INTERVAL = SIX_HUNDRED_MS;
export const PHASE2_THROW_PAPER_COUNT = 3;
export const PHASE2_CHARGE_SPEED = 4;
export const PHASE2_PUSH_ACTIVE_DURATION = THREE_HUNDRED_MS;
export const LASER_DAMAGE_INTERVAL = FIFTY_MS;
export const LASER_BODY_OFFSET = 120;

export function initMaugreloAi(npcPhase: number = 1): MaugreloAI {
  return {
    knownPhase: npcPhase,
    actionState: "idle",
    actionStart: 0,
    currentAction: null,
    meleeHitTriggered: false,
    lastThrow: 0,
    lastSlap: 0,
    lastPush: 0,
    flyingPaper: null,
    groundPapers: [],
    landedPapers: [],
    stuckPapers: [],
    paperIdCounter: 0,
    lastPaperHitId: 0,
    meditationArmorBonus: 0,
    lastArmorBuff: 0,
    walkingStartTime: 0,
    phase2State: "rising",
    riseStartY: 0,
    orbitPapers: [],
    lastPaperFire: 0,
    phase2StageStart: 0,
    laser: null,
    lastLaserDamage: 0,
    appliedDebuff: null,
    papersThrownCount: 0,
    lastPaperThrow: 0,
    pushHitTriggered: false,
  };
}

export function handlePhaseChange(ai: MaugreloAI, npcPhase: number): void {
  ai.knownPhase = npcPhase;
  ai.phase2State = "rising";
  ai.orbitPapers = [];
  ai.lastPaperFire = 0;
  ai.actionState = "idle";
  ai.currentAction = null;
  ai.flyingPaper = null;
  ai.groundPapers = [];
  ai.landedPapers = [];
  ai.stuckPapers = [];
  ai.laser = null;
  ai.lastLaserDamage = 0;
  ai.appliedDebuff = null;
  ai.papersThrownCount = 0;
  ai.lastPaperThrow = 0;
  ai.pushHitTriggered = false;
}
