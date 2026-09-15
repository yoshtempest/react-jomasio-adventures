import {
  ONE_HUNDRED_MS,
  ONE_HUNDRED_FIFTY_MS,
  THREE_HUNDRED_MS,
} from "@/data/ms";

export const EMANUEL_COMBO_WINDOW_MS = THREE_HUNDRED_MS;
export const EMANUEL_AIR_LAUNCH_MS = ONE_HUNDRED_MS;
export const EMANUEL_AIR_GRAB_DURATION_MS = ONE_HUNDRED_FIFTY_MS;

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