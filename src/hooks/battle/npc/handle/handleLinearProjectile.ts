import { ProjectileConstants, ProjectileHpConstants } from "@/data/projectile";
import {
  shouldCutProjectile,
  createSlicedProjectile,
} from "@/gameRules/npc/projectileCut";
import { tryMeleeIntercept } from "../tryMeleeIntercept";

export type LinearOpts = {
  playerX: number;
  playerY: number;
  playerState: PlayerState;
  playerCharacter?: string;
  playerDirection?: Direction;
  npcClass: NPCClass;
  sphere?: PlayerSpecialProjectile;
  onDestroyed?: () => void;
  onHit: () => void;
  onPullPlayer?: (x: number) => void;
  onMiss?: (x: number) => void;
  onStick?: () => void;
};

export function handleLinearProjectile(
  p: ProjectileCommon | ProjectilePull,
  opts: LinearOpts,
): ProjectileCommon | ProjectilePull | ProjectileCut | null {
  if (p.state === "walk") {
    if (Date.now() - p.createdAt >= 500) {
      return { ...p, state: "idle" };
    }
    return p;
  }

  const next = {
    ...p,
    x: p.x + p.dirX * ProjectileConstants.SPEED,
    y: p.y + p.dirY * ProjectileConstants.SPEED,
  };

  // Colisão com a esfera do Riquelme em voo: a esfera (indestrutível) aniquila
  // projéteis inimigos no seu caminho.
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

  // Ataque do jogador intercepta o projétil no alcance: o Marcelo divide em
  // duas partes (corte nunca destrói); os demais causam dano de HP.
  const intercepted = tryMeleeIntercept(p, next, opts);
  if (intercepted !== undefined) return intercepted;

  if (
    next.x < -ProjectileConstants.OFFSCREEN_MARGIN ||
    next.x >
      ProjectileConstants.MAP_WIDTH + ProjectileConstants.OFFSCREEN_MARGIN ||
    next.y < -ProjectileConstants.OFFSCREEN_MARGIN ||
    next.y >
      ProjectileConstants.MAP_HEIGHT + ProjectileConstants.OFFSCREEN_MARGIN
  ) {
    if (p.variant === "common" && p.landsOnGround) {
      const landX = Math.max(
        0,
        Math.min(ProjectileConstants.MAP_WIDTH, next.x),
      );
      opts.onMiss?.(landX);
    }
    return null;
  }

  const dx = Math.abs(opts.playerX - next.x);
  const isDashing = opts.playerState === "dash";
  const isCrouched =
    opts.playerState === "idleCrounched" ||
    opts.playerState === "walkCrounched";
  const canCrouchDodge =
    p.variant === "common" ? (p.canCrouchDodge ?? true) : true;
  const dodgeProjectile = isDashing || (isCrouched && canCrouchDodge);

  const hitY = isCrouched && canCrouchDodge ? opts.playerY - 30 : opts.playerY;
  const hitDy = Math.abs(hitY - next.y);

  if (dx < 40 && hitDy <= 160 && !dodgeProjectile) {
    const cut = shouldCutProjectile({
      projectile: next,
      playerX: opts.playerX,
      playerY: opts.playerY,
      playerState: opts.playerState,
      playerCharacter: opts.playerCharacter ?? "",
      playerDirection: opts.playerDirection ?? "left",
      npcClass: opts.npcClass,
    });
    if (cut) {
      return createSlicedProjectile(next, next.x, next.y);
    }

    if (p.variant === "pull") {
      opts.onPullPlayer?.(p.pullTargetX);
    }
    if (p.variant === "common" && p.landsOnGround) {
      opts.onStick?.();
    } else {
      opts.onHit();
    }
    return null;
  }

  return next;
}