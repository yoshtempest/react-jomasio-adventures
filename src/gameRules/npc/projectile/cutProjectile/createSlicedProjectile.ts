import { ProjectileHpConstants } from "@/data/projectile";

import { nextProjectileId } from "../projectileId";

const PROJECTILE_CUT_VECTORS = {
  upper: { y: -Math.SQRT1_2 },
  lower: { y: Math.SQRT1_2 },
} as const;

/** Converte um projétil linear em um projétil cortado com as duas partes. */
export function createSlicedProjectile(
  p: ProjectileCommon | ProjectilePull,
  x = p.x,
  y = p.y,
): ProjectileCut {
  const { upper, lower } = PROJECTILE_CUT_VECTORS;

  const horizontalSign = p.dirX < 0 ? -1 : 1;
  const horizontal = horizontalSign * Math.SQRT1_2;

  return {
    variant: "cut",
    id: nextProjectileId(),
    x,
    y,
    startX: p.startX,
    startY: p.startY,
    sprite: p.sprite,
    createdAt: Date.now(),
    state: "idle",
    upper: { x, y },
    lower: { x, y },
    upperDirX: horizontal,
    upperDirY: upper.y,
    lowerDirX: horizontal,
    lowerDirY: lower.y,
    hp: ProjectileHpConstants.CUT_FRAGMENT_HP,
    maxHp: ProjectileHpConstants.CUT_FRAGMENT_HP,
    indestructible: false,
  };
}