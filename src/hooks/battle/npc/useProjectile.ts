import { useEffect } from "react";
import type { Dispatch, SetStateAction } from "react";
import { useLatestRef } from "@/hooks/useLatestRef";
import { ProjectileConstants } from "@/data/projectile";
import {
  shouldCutProjectile,
  createSlicedProjectile,
  updateSlicedProjectile,
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
) {
  const onHitRef = useLatestRef(onHit);
  const onPullPlayerRef = useLatestRef(onPullPlayer);
  const onMissRef = useLatestRef(onMiss);
  const onStickRef = useLatestRef(onStick);
  const onBurstHitRef = useLatestRef(onBurstHit);
  const playerXRef = useLatestRef(playerX);
  const playerYRef = useLatestRef(playerY);
  const playerStateRef = useLatestRef(playerState);
  const playerCharacterRef = useLatestRef(playerCharacter);
  const playerDirectionRef = useLatestRef(_playerDirection);
  const npcClassRef = useLatestRef(npcClass);

  useEffect(() => {
    const count = projectiles.length;
    if (count === 0) return;

    const interval = setInterval(() => {
      if (hitstopRef.current > Date.now()) return;

      const misses: number[] = [];
      let stick = false;

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
                onHit: onHitRef.current,
                onPullPlayer: onPullPlayerRef.current,
              });
            case "cut":
              return updateSlicedProjectile(p);
            case "rain":
              return handleRain(
                p,
                playerXRef.current,
                playerStateRef.current,
                onHitRef.current,
              );
            case "burst":
              return handleBurstProjectile(p, {
                playerX: playerXRef.current,
                playerY: playerYRef.current,
                playerState: playerStateRef.current,
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
    playerXRef,
    playerYRef,
    playerStateRef,
    playerCharacterRef,
    playerDirectionRef,
    npcClassRef,
  ]);
}

function handleLinearProjectile(
  p: ProjectileCommon | ProjectilePull,
  opts: {
    playerX: number;
    playerY: number;
    playerState: PlayerState;
    playerCharacter?: string;
    playerDirection?: Direction;
    npcClass: NPCClass;
    onHit: () => void;
    onPullPlayer?: (x: number) => void;
    onMiss?: (x: number) => void;
    onStick?: () => void;
  },
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
      projectile: p,
      playerX: opts.playerX,
      playerY: opts.playerY,
      playerState: opts.playerState,
      playerCharacter: opts.playerCharacter ?? "",
      playerDirection: opts.playerDirection ?? "left",
      npcClass: opts.npcClass,
    });
    if (cut) {
      return createSlicedProjectile(p, next.x, next.y);
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

function handleRain(
  p: ProjectileRain,
  playerX: number,
  playerState: PlayerState,
  onHit: () => void,
): ProjectileRain | null {
  const now = Date.now();
  const elapsed = now - p.warningStartTime;

  // Warning phase — spears not yet falling
  if (elapsed < p.warningDuration) {
    return p;
  }

  // Falling phase
  let allDone = true;
  const newSpears = p.spears.map((s) => {
    if (s.hit || s.y > ProjectileConstants.OFFSCREEN_BOTTOM) return s;
    allDone = false;

    const newY = s.y + ProjectileConstants.SPEAR_FALL_SPEED;
    const isDashing = playerState === "dash";

    const isCrouched =
      playerState === "idleCrounched" || playerState === "walkCrounched";
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
