import { ProjectileConstants, ProjectileHpConstants } from "@/data/projectile";
import { isStrikeState } from "@/gameRules/battle/strikeState";
import { applyPlayerStrike } from "../apply/applyPlayerStrike";
import type { StrikeOpts } from "../apply/applyPlayerStrike";

export function handleRain(
  p: ProjectileRain,
  playerX: number,
  playerY: number,
  playerState: PlayerState,
  onHit: () => void,
  onDestroyed?: () => void,
  strike?: Omit<StrikeOpts, "playerState" | "point">,
  /** Multiplicador de tempo da entidade (regra `gameRules/battle/tempo`). */
  speedScale = 1,
): ProjectileRain | null {
  const now = Date.now();
  const elapsed = now - p.warningStartTime;

  // Warning phase — spears not yet falling
  if (elapsed < p.warningDuration) {
    return p;
  }

  const isDashing = playerState === "dash";

  // Golpe do jogador (básico ou special) causa o dano real do ataque na chuva
  // inteira, usando a lança mais próxima dentro do alcance como âncora.
  if (!p.indestructible && isStrikeState(playerState) && strike) {
    const spear = p.spears
      .filter(
        (s) =>
          !s.hit &&
          Math.abs(playerY - s.y) <=
            ProjectileHpConstants.RAIN_DESTROY_VERTICAL_RANGE &&
          Math.abs(playerX - s.x) <= ProjectileHpConstants.RAIN_DESTROY_RANGE_X,
      )
      .sort((a, b) => Math.abs(playerX - a.x) - Math.abs(playerX - b.x))[0];

    if (spear) {
      const struck = applyPlayerStrike(p, {
        ...strike,
        playerState,
        point: { x: spear.x, y: spear.y },
        onDestroyed,
      });
      if (struck.hit) return struck.projectile;
    }
  }

  const isCrouched =
    playerState === "idleCrounched" || playerState === "walkCrounched";

  // Falling phase
  let allDone = true;
  const newSpears = p.spears.map((s) => {
    if (s.hit || s.y > ProjectileConstants.OFFSCREEN_BOTTOM) return s;
    allDone = false;

    const newY = s.y + ProjectileConstants.SPEAR_FALL_SPEED * speedScale;

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
