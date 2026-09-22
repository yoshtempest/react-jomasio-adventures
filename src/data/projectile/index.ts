import { FOUR_HUNDRED_MS } from "@/data/ms";

export const ProjectileConstants = {
  SPEED: 17,
  SPEAR_FALL_SPEED: 18,
  OFFSCREEN_MARGIN: 200,
  MAP_WIDTH: 1000,
  MAP_HEIGHT: 600,
  OFFSCREEN_BOTTOM: 800,
  /** Velocidade da burst do hungryKing (fase 2). */
  BURST_SPEED: 17,
  /** Tempo que a burstExplosion fica visível antes de sumir. */
  BURST_EXPLOSION_MS: 400,
};

export const PlayerSpecialConstants = {
  SPHERE_OFFSET_X: 30,
  FIRE_DURATION: FOUR_HUNDRED_MS,
  FIRE_DISTANCE: 700,
  MERGE_TIME_SCALE: 0.7,
  MOVE_TIME_SCALE: 0.9,
};
