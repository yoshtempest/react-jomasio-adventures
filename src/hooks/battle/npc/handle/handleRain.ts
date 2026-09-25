import { ProjectileConstants, ProjectileHpConstants } from "@/data/projectile";

export function handleRain(
  p: ProjectileRain,
  playerX: number,
  playerY: number,
  playerState: PlayerState,
  onHit: () => void,
  onDestroyed?: () => void,
): ProjectileRain | null {
  const now = Date.now();
  const elapsed = now - p.warningStartTime;

  // Warning phase — spears not yet falling
  if (elapsed < p.warningDuration) {
    return p;
  }

  const isDashing = playerState === "dash";

  // Ataque do jogador destruí a chuva inteira (a lança próxima do alcance).
  if (!p.indestructible && playerState === "attack") {
    const reachable = p.spears.some(
      (s) =>
        !s.hit &&
        Math.abs(playerY - s.y) <=
          ProjectileHpConstants.RAIN_DESTROY_VERTICAL_RANGE &&
        Math.abs(playerX - s.x) <= ProjectileHpConstants.RAIN_DESTROY_RANGE_X,
    );
    if (reachable) {
      onDestroyed?.();
      return null;
    }
  }

  const isCrouched =
    playerState === "idleCrounched" || playerState === "walkCrounched";

  // Falling phase
  let allDone = true;
  const newSpears = p.spears.map((s) => {
    if (s.hit || s.y > ProjectileConstants.OFFSCREEN_BOTTOM) return s;
    allDone = false;

    const newY = s.y + ProjectileConstants.SPEAR_FALL_SPEED;

    if (
      !s.hit &&
      newY >= 550 &&
      newY <= ProjectileConstants.OFFSCREEN_BOTTOM &&
      !isDashing &&
      !isCrouched
    ) {
      const dx = Math.abs(playerX - s.x);
      if (dx < 30) {
        onHit();
        return { x: s.x, y: newY, hit: true };
      }
    }

    return { x: s.x, y: newY };
  });

  if (allDone) return null;

  return { ...p, spears: newSpears };
}