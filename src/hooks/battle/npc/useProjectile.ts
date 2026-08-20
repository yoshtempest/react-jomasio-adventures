import { useEffect } from "react";
import type { Dispatch, SetStateAction } from "react";
import { useLatestRef } from "@/hooks/useLatestRef";
import { ProjectileConstants } from "@/data/projectile";

export function useProjectile(
  projectile: Projectile | null,
  setProjectile: Dispatch<SetStateAction<Projectile | null>>,
  playerX: number,
  playerY: number,
  playerState: playerState,
  _playerDirection: Direction,
  _npcX: number,
  _npcY: number,
  onHit: () => void,
  hitstopRef: React.RefObject<number>,
  onPullPlayer?: (x: number) => void,
) {
  const onHitRef = useLatestRef(onHit);
  const onPullPlayerRef = useLatestRef(onPullPlayer);

  useEffect(() => {
    if (!projectile) return;

    const interval = setInterval(() => {
      if (hitstopRef.current > Date.now()) return;
      setProjectile((p) => {
        if (!p) return null;

        switch (p.variant) {
          case "common":
            return handleLinearProjectile(p, {
              playerX,
              playerY,
              playerState,
              onHit: onHitRef.current,
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
            return handleRain(p, playerX, playerState, onHitRef.current);
        }
      });
    }, 20);

    return () => clearInterval(interval);
  }, [projectile, playerX, playerY, playerState, setProjectile, hitstopRef, onHitRef, onPullPlayerRef]);
}

function handleLinearProjectile(
  p: ProjectileCommon | ProjectilePull,
  opts: {
    playerX: number;
    playerY: number;
    playerState: playerState;
    onHit: () => void;
    onPullPlayer?: (x: number) => void;
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
    return null;
  }

  const dx = Math.abs(opts.playerX - next.x);
  const isDashing = opts.playerState === "dash";
  const isCrouched =
    opts.playerState === "idleCrounched" || opts.playerState === "walkCrounched";
  const dodgeProjectile = isDashing || isCrouched;

  const hitY = isCrouched ? opts.playerY - 30 : opts.playerY;
  const hitDy = Math.abs(hitY - next.y);

  if (dx < 40 && hitDy <= 120 && !dodgeProjectile) {
    if (p.variant === "pull") {
      opts.onPullPlayer?.(p.pullTargetX);
    }
    opts.onHit();
    return null;
  }

  return next;
}

function handleRain(
  p: ProjectileRain,
  playerX: number,
  playerState: playerState,
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
