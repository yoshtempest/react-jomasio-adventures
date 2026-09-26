import { ProjectileConstants, ProjectileHpConstants } from "@/data/projectile";
import { isPlayerInRange } from "@/gameRules/battle/range";
import { isSpecialStrikeState, isStrikeState } from "@/gameRules/battle/strikeState";
import { getProjectileDamagePoint } from "@/gameRules/npc/projectileDamage";
import { applyPlayerStrike } from "../apply/applyPlayerStrike";
import type { StrikeOpts } from "../apply/applyPlayerStrike";

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
    claimToken?: StrikeOpts["claimToken"];
    resolveHit?: StrikeOpts["resolveHit"];
    spawnDamage?: StrikeOpts["spawnDamage"];
    onBurstHit: ((pushDir: number) => void) | undefined;
    /** Multiplicador de tempo da entidade (regra `gameRules/battle/tempo`). */
    speedScale?: number;
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
    x:
      p.x +
      p.dirX * ProjectileConstants.BURST_SPEED * (opts.speedScale ?? 1),
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

  // Golpe do jogador (básico ou special): burst é destrutível pelo dano real do
  // ataque (corte não se aplica).
  if (!next.indestructible && isStrikeState(opts.playerState)) {
    const inRange = isPlayerInRange(
      opts.playerX,
      opts.playerY,
      next.x,
      next.y,
      opts.playerState,
      opts.playerCharacter ?? "",
      isSpecialStrikeState(opts.playerState),
      false,
      opts.npcClass,
    );
    if (inRange) {
      const struck = applyPlayerStrike(next, {
        playerState: opts.playerState,
        claimToken: opts.claimToken,
        resolveHit: opts.resolveHit,
        spawnDamage: opts.spawnDamage,
        point: getProjectileDamagePoint(next),
        onDestroyed: opts.onDestroyed,
      });
      // Golpe já gasto neste ataque (ou sem dano): a burst segue o trajeto
      // normal, sem número e sem perder HP.
      if (struck.hit) return struck.projectile;
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