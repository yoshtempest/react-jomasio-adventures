import {
  TWO_HUNDRED_FIFTY_MS,
  THREE_HUNDRED_MS,
  FOUR_HUNDRED_FIFTY_MS,
  EIGHT_HUNDRED_MS,
} from "@/data/ms";

export const GRID_STEP = 1;
export const BATTLE_STEP = 10;
export const DASH_STEP = 25;
export const DASH_DURATION = THREE_HUNDRED_MS;
export const DASH_INTERVAL = 30;

export const NPC_BASE_SPEED = 2;
export const NPC_RUNNING_SPEED = 4;

export const BATTLE_LIMITS = {
  minX: 80,
  maxX: 950,
};

export const JUMP_DURATION = FOUR_HUNDRED_FIFTY_MS;

export const ATTACK_DURATION = TWO_HUNDRED_FIFTY_MS;
export const SPECIAL_DURATION = EIGHT_HUNDRED_MS;
