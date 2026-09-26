import { ProjectileHpConstants } from "@/data/projectile";

import { nextProjectileId } from "../projectileId";
import type { PullParams } from "./types";

export function createPullProjectile({
  startX,
  startY,
  targetX,
  targetY,
  sprite,
  state = "walk",
  pullTargetX,
  hp = ProjectileHpConstants.DEFAULT_HP,
  maxHp = hp,
  indestructible = false,
}: PullParams): ProjectilePull {
  const dx = targetX - startX;
  const dy = targetY - startY;
  const length = Math.hypot(dx, dy) || 1;

  return {
    variant: "pull",
    id: nextProjectileId(),
    x: startX,
    y: startY,
    startX,
    startY,
    dirX: dx / length,
    dirY: dy / length,
    sprite,
    createdAt: Date.now(),
    state,
    pullTargetX,
    hp,
    maxHp,
    indestructible,
  };
}