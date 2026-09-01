import { useEffect } from "react";
import type { Dispatch, SetStateAction } from "react";
import { useLatestRef } from "@/hooks/useLatestRef";
import { ProjectileConstants } from "@/data/projectile";

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
) {
  const onHitRef = useLatestRef(onHit);
  const onPullPlayerRef = useLatestRef(onPullPlayer);
  const onMissRef = useLatestRef(onMiss);
  const onStickRef = useLatestRef(onStick);

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
                playerX,
                playerY,
                playerState,
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
                playerX,
                playerY,
                playerState,
                onHit: onHitRef.current,
                onPullPlayer: onPullPlayerRef.current,
              });
            case "rain":
              return handleRain(
                p,
                playerX,
                playerState,
                onHitRef.current,
              );
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
    playerX,
    playerY,
    playerState,
    setProjectiles,
    hitstopRef,
    onHitRef,
    onPullPlayerRef,
    onMissRef,
    onStickRef,
  ]);
}

function handleLinearProjectile(
  p: ProjectileCommon | ProjectilePull,
  opts: {
    playerX: number;
    playerY: number;
    playerState: PlayerState;
    onHit: () => void;
    onPullPlayer?: (x: number) => void;
    onMiss?: (x: number) => void;
    onStick?: () => void;
  },
): ProjectileCommon | ProjectilePull | null {
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

  if (dx < 40 && hitDy <= 120 && !dodgeProjectile) {
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
