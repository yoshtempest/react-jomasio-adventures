import { useEffect } from "react";
import type { Dispatch, SetStateAction } from "react";
import { useLatestRef } from "@/hooks/useLatestRef";
import { ProjectileConstants, ProjectileHpConstants } from "@/data/projectile";
import { isPlayerInRange } from "@/gameRules/battle/range";
import {
  shouldCutProjectile,
  createSlicedProjectile,
  updateSlicedProjectile,
  MARSHADOW_CHARACTER_ID,
} from "@/gameRules/npc/projectileCut";

export function useProjectile(
  projectiles: Projectile[],
  setProjectiles: Dispatch<SetStateAction<Projectile[]>>,
  playerX: number,
  playerY: number,
  playerState: PlayerState,
  _playerDirection: Direction,
  _npcX: number,
  _npcY: number,
  onHit: () => void,
  hitstopRef: React.RefObject<number>,
  onPullPlayer?: (x: number) => void,
  onMiss?: (x: number) => void,
  onStick?: () => void,
  playerCharacter?: string,
  npcClass: NPCClass = "common",
  onBurstHit?: (pushDir: number) => void,
  playerProjectileRef?: React.RefObject<PlayerSpecialProjectile | null>,
  onProjectileDestroyed?: () => void,
) {
  const onHitRef = useLatestRef(onHit);
  const onPullPlayerRef = useLatestRef(onPullPlayer);
  const onMissRef = useLatestRef(onMiss);
  const onStickRef = useLatestRef(onStick);
  const onBurstHitRef = useLatestRef(onBurstHit);
  const onProjectileDestroyedRef = useLatestRef(onProjectileDestroyed);
  const playerXRef = useLatestRef(playerX);
  const playerYRef = useLatestRef(playerY);
  const playerStateRef = useLatestRef(playerState);
  const playerCharacterRef = useLatestRef(playerCharacter);
  const playerDirectionRef = useLatestRef(_playerDirection);
  const npcClassRef = useLatestRef(npcClass);
  const npcXRef = useLatestRef(_npcX);
  const npcYRef = useLatestRef(_npcY);

  useEffect(() => {
    const count = projectiles.length;
    if (count === 0) return;

    const interval = setInterval(() => {
      if (hitstopRef.current > Date.now()) return;

      const misses: number[] = [];
      let stick = false;

      // Esfera do Riquelme em voo (phase "fire") destrói projéteis no caminho.
      const sphere =
        playerProjectileRef?.current?.phase === "fire"
          ? playerProjectileRef.current
          : undefined;
      const destroy = () => onProjectileDestroyedRef.current?.();

      const next = projectiles
        .map((p) => {
          switch (p.variant) {
            case "common":
              return handleLinearProjectile(p, {
                playerX: playerXRef.current,
                playerY: playerYRef.current,
                playerState: playerStateRef.current,
                playerCharacter: playerCharacterRef.current,
                playerDirection: playerDirectionRef.current,
                npcClass: npcClassRef.current,
                sphere,
                onDestroyed: destroy,
                onHit: onHitRef.current,
                onMiss: (x) => {
                  misses.push(x);
                },
                onStick: () => {
                  stick = true;
                },
              });
            case "pull":
              return handleLinearProjectile(p, {
                playerX: playerXRef.current,
                playerY: playerYRef.current,
                playerState: playerStateRef.current,
                playerCharacter: playerCharacterRef.current,
                playerDirection: playerDirectionRef.current,
                npcClass: npcClassRef.current,
                sphere,
                onDestroyed: destroy,
                onHit: onHitRef.current,
                onPullPlayer: onPullPlayerRef.current,
              });
            case "cut":
              return handleCut(p, {
                npcX: npcXRef.current,
                npcY: npcYRef.current,
                onDestroyed: destroy,
              });
            case "rain":
              return handleRain(
                p,
                playerXRef.current,
                playerYRef.current,
                playerStateRef.current,
                onHitRef.current,
                destroy,
              );
            case "burst":
              return handleBurstProjectile(p, {
                playerX: playerXRef.current,
                playerY: playerYRef.current,
                playerState: playerStateRef.current,
                playerCharacter: playerCharacterRef.current,
                npcClass: npcClassRef.current,
                sphere,
                onDestroyed: destroy,
                onBurstHit: onBurstHitRef.current,
              });
          }
        })
        .filter((p): p is Projectile => p !== null);

      if (stick) onStickRef.current?.();
      for (const x of misses) onMissRef.current?.(x);
      setProjectiles(next);
    }, 20);

    return () => clearInterval(interval);
  }, [
    projectiles,
    setProjectiles,
    hitstopRef,
    onHitRef,
    onPullPlayerRef,
    onMissRef,
    onStickRef,
    onBurstHitRef,
    onProjectileDestroyedRef,
    playerXRef,
    playerYRef,
    playerStateRef,
    playerCharacterRef,
    playerDirectionRef,
    npcClassRef,
    npcXRef,
    npcYRef,
    playerProjectileRef,
  ]);
}

type LinearOpts = {
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

function handleLinearProjectile(
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

/**
 * Interceptação por ataque do jogador (projéteis common/pull).
 *
 * - Marcelo: a corte passiva desvia o projétil dividindo em 2 — nunca o
 *   destrói. Projéteis indestrutíveis não podem ser cortados.
 * - Demais personagens: o ataque causa dano de HP, destruindo ao zerar.
 *
 * Retorna null (destruído), um projétil cortado, ou undefined (segue sem
 * interceptação).
 */
function tryMeleeIntercept(
  p: ProjectileCommon | ProjectilePull,
  next: ProjectileCommon | ProjectilePull,
  opts: LinearOpts,
): ProjectileCommon | ProjectilePull | ProjectileCut | null | undefined {
  if (opts.playerState !== "attack") return undefined;
  if (p.indestructible) return undefined;

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
  if (!inRange) return undefined;

  const isMarcelo = opts.playerCharacter === MARSHADOW_CHARACTER_ID;
  if (isMarcelo) {
    const cut = shouldCutProjectile({
      projectile: next,
      playerX: opts.playerX,
      playerY: opts.playerY,
      playerState: opts.playerState,
      playerCharacter: opts.playerCharacter ?? "",
      playerDirection: opts.playerDirection ?? "left",
      npcClass: opts.npcClass,
    });
    if (cut) return createSlicedProjectile(next, next.x, next.y);
    return undefined;
  }

  return applyMeleeDamage(next, opts.onDestroyed);
}

function applyMeleeDamage(
  p: ProjectileCommon | ProjectilePull,
  onDestroyed?: () => void,
): ProjectileCommon | ProjectilePull | null {
  const hp = p.hp - ProjectileHpConstants.PLAYER_MELEE_DAMAGE;
  if (hp <= 0) {
    onDestroyed?.();
    return null;
  }
  return { ...p, hp };
}

/**
 * Fragmentos cortados pelo Marcelo avançam até saírem da tela. Quando um
 * fragmento (que voltou ao NPC em cenário espelhado) chega perto dele, o NPC
 * o destrói — a corte desvia, mas o alvo pode aniquilar o que retorna.
 */
function handleCut(
  p: ProjectileCut,
  opts: { npcX: number; npcY: number; onDestroyed?: () => void },
): ProjectileCut | null {
  const next = updateSlicedProjectile(p);
  if (!next) return null;

  const nearNpc =
    Math.hypot(next.upper.x - opts.npcX, next.upper.y - opts.npcY) <=
      ProjectileHpConstants.CUT_FRAGMENT_DESTROY_RADIUS ||
    Math.hypot(next.lower.x - opts.npcX, next.lower.y - opts.npcY) <=
      ProjectileHpConstants.CUT_FRAGMENT_DESTROY_RADIUS;
  if (nearNpc) {
    opts.onDestroyed?.();
    return null;
  }
  return next;
}

function handleRain(
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

/**
 * Burst do hungryKing (fase 2): viaja na horizontal até a ponta do mapa;
 * ao passar pelo jogador vira `burstExplosion` (dano + push de 50px x/y) e
 * some após um instante.
 */
function handleBurstProjectile(
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