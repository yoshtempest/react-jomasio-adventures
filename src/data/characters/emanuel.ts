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
};

export const EMANUEL_COMBO_STEPS = [
  { state: "punch", multiplier: 1, windupState: "preAttack" },
  { state: "hook", multiplier: 1.15, windupState: "preAttack" },
  { state: "lowKick", multiplier: 1.3, windupState: "preAttack" },
  { state: "airKick", multiplier: 1.5, windupState: "jump" },
] as const satisfies readonly EmanuelComboStep[];

export const EMANUEL_COMBO_STATES = new Set<PlayerState>([
  "punch",
  "hook",
  "lowKick",
  "airGrab",
  "airKick",
]);