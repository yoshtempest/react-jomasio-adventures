import { ProjectileConstants } from "@/data/projectile";


/** Velocidade dos fragmentos depois do corte. */
export const PROJECTILE_CUT_SPEED = 17;

/** Avança os dois fragmentos cortados; retorna null quando saem da tela. */
export function updateSlicedProjectile(p: ProjectileCut): ProjectileCut | null {
  const upper = {
    x: p.upper.x + p.upperDirX * PROJECTILE_CUT_SPEED,
    y: p.upper.y + p.upperDirY * PROJECTILE_CUT_SPEED,
  };
  const lower = {
    x: p.lower.x + p.lowerDirX * PROJECTILE_CUT_SPEED,
    y: p.lower.y + p.lowerDirY * PROJECTILE_CUT_SPEED,
  };

  const offscreen = (coords: { x: number; y: number }) =>
    coords.x < -ProjectileConstants.OFFSCREEN_MARGIN ||
    coords.x >
      ProjectileConstants.MAP_WIDTH + ProjectileConstants.OFFSCREEN_MARGIN ||
    coords.y < -ProjectileConstants.OFFSCREEN_MARGIN ||
    coords.y >
      ProjectileConstants.MAP_HEIGHT + ProjectileConstants.OFFSCREEN_MARGIN;

  if (offscreen(upper) && offscreen(lower)) return null;

  return { ...p, upper, lower };
}
