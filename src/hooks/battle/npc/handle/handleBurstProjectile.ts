import { ProjectileConstants, ProjectileHpConstants } from "@/data/projectile";
import { isPlayerInRange } from "@/gameRules/battle/range";

/**
 * Burst do hungryKing (fase 2): viaja na horizontal até a ponta do mapa;
 * ao passar pelo jogador vira `burstExplosion` (dano + push de 50px x/y) e
 * some após um instante.
 */
export function handleBurstProjectile(
  p: ProjectileBurst,
  opts: {
    playerX: number;
    playerY: number;
    playerState: PlayerState;
    playerCharacter?: string;
    npcClass: NPCClass;
    sphere?: PlayerSpecialProjectile;
    onDestroyed?: () => void;
    onBurstHit: ((pushDir: number) => void) | undefined;
  },
): ProjectileBurst | null {
  if (p.exploded) {
    if (Date.now() - (p.explodedAt ?? p.createdAt) >= ProjectileConstants.BURST_EXPLOSION_MS) {
      return null;
    }
    return p;
  }

  const next = {
    ...p,
    x: p.x + p.dirX * ProjectileConstants.BURST_SPEED,
  };

  // Colisão com a esfera do Riquelme em voo.
  if (
    opts.sphere &&
    !next.indestructible &&
    Math.abs(opts.sphere.x - next.x) <=
      ProjectileHpConstants.SPHERE_HIT_RANGE_X &&
    Math.abs(opts.sphere.y - next.y) <=
      ProjectileHpConstants.SPHERE_HIT_RANGE_Y
  ) {
    opts.onDestroyed?.();
    return null;
  }

  // Ataque do jogador: burst é destrutível por dano de HP (corte não se aplica).
  if (!next.indestructible && opts.playerState === "attack") {
    const inRange = isPlayerInRange(
      opts.playerX,
      opts.playerY,
      next.x,
      next.y,
      "attack",
      opts.playerCharacter ?? "",
      false,
      false,
      opts.npcClass,
    );
    if (inRange) {
      const hp = next.hp - ProjectileHpConstants.PLAYER_MELEE_DAMAGE;
      if (hp <= 0) {
        opts.onDestroyed?.();
        return null;
      }
      return { ...next, hp };
    }
  }

  if (
    next.x < -ProjectileConstants.OFFSCREEN_MARGIN ||
    next.x > ProjectileConstants.MAP_WIDTH + ProjectileConstants.OFFSCREEN_MARGIN
  ) {
    return null;
  }

  const isDashing = opts.playerState === "dash";
  const isCrouched =
    opts.playerState === "idleCrounched" || opts.playerState === "walkCrounched";
  if (isDashing || isCrouched) return next;

  const hitY = isCrouched ? opts.playerY - 30 : opts.playerY;
  const hitDy = Math.abs(hitY - next.y);
  const dx = Math.abs(opts.playerX - next.x);

  if (dx < 60 && hitDy <= 140) {
    opts.onBurstHit?.(p.dirX);
    return {
      ...next,
      exploded: true,
      explodedAt: Date.now(),
      sprite: "burstExplosion",
    };
  }

  return next;
}