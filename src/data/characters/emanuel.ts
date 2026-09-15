import {
  ONE_HUNDRED_MS,
  ONE_HUNDRED_FIFTY_MS,
  THREE_HUNDRED_MS,
} from "@/data/ms";

export const EMANUEL_COMBO_WINDOW_MS = THREE_HUNDRED_MS;
export const EMANUEL_AIR_LAUNCH_MS = ONE_HUNDRED_MS;
export const EMANUEL_AIR_GRAB_DURATION_MS = ONE_HUNDRED_FIFTY_MS;

// ── Habilidade de instância (clone de silhueta) ─────────────────────────────
/** Ki mínimo para iniciar a habilidade (o custo real é proporcional à distância). */
export const EMANUEL_CLONE_MIN_KI = 1;
/** Teto de Ki consumido no release (proporcional à distância percorrida). */
export const EMANUEL_CLONE_MAX_COST = 50;
/** Ki consumido por pixel de distância percorrida pelo clone. */
export const EMANUEL_CLONE_KI_PER_PIXEL = 0.05;
/** Time scale aplicado na batalha enquanto o botão está segurado. */
export const EMANUEL_CLONE_TIME_SCALE = 0.5;
/** Intervalo do tick de movimento da instância (~2x a velocidade do player). */
export const EMANUEL_CLONE_MOVE_TICK_MS = 16;
/** Passo de movimento da instância por tick. */
export const EMANUEL_CLONE_MOVE_PX = 10;
/** Caixa de colisão da instância contra o terreno. */
export const EMANUEL_CLONE_COLLISION_W = 30;
export const EMANUEL_CLONE_COLLISION_H = 50;

export type EmanuelComboStep = {
  state: PlayerState;
  multiplier: number;
  windupState: PlayerState;
  /** Distância que o inimigo é empurrado para trás no golpe. */
  pushDistance: number;
  /** Distância que o Emanuel avança em direção ao inimigo no golpe. */
  forwardDistance: number;
};

export const EMANUEL_COMBO_STEPS = [
  {
    state: "punch",
    multiplier: 1,
    windupState: "preAttack",
    pushDistance: 20,
    forwardDistance: 30,
  },
  {
    state: "hook",
    multiplier: 1.15,
    windupState: "preAttack",
    pushDistance: 30,
    forwardDistance: 38,
  },
  {
    state: "lowKick",
    multiplier: 1.3,
    windupState: "lowKick",
    pushDistance: 42,
    forwardDistance: 44,
  },
  {
    state: "airKick",
    multiplier: 1.5,
    windupState: "jump",
    pushDistance: 56,
    forwardDistance: 50,
  },
] as const satisfies readonly EmanuelComboStep[];

export const EMANUEL_COMBO_STATES = new Set<PlayerState>([
  "punch",
  "hook",
  "lowKick",
  "airGrab",
  "airKick",
]);