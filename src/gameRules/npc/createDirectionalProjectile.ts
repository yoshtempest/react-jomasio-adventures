import type { Projectile } from "@/utils/types/projectile";

type Params = {
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  sprite?: string;
  state: "walk" | "idle";
};

export function createDirectionalProjectile({
  startX,
  startY,
  targetX,
  targetY,
  sprite,
  state,
}: Params): Projectile {
  const dx = targetX - startX;
  const dy = targetY - startY;

  const length = Math.hypot(dx, dy) || 1;

  return {
    x: startX,
    y: startY,

    startX,
    startY,

    dirX: dx / length,
    dirY: dy / length,

    sprite,
    createdAt: Date.now(),
    state,
  };
}