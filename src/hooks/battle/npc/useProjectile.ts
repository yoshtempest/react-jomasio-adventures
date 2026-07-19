import { useEffect, useRef } from "react";
import type { Dispatch, SetStateAction } from "react";
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
  const onHitRef = useRef(onHit);
  onHitRef.current = onHit;
  const onPullPlayerRef = useRef(onPullPlayer);
  onPullPlayerRef.current = onPullPlayer;

  useEffect(() => {
    if (!projectile) return;

    const interval = setInterval(() => {
      if (hitstopRef.current > Date.now()) return;
      setProjectile((p) => {
        if (!p) return null;

        switch (p.variant) {
          case "common":
            return handleCommon(
              p,
              playerX,
              playerY,
              playerState,
              onHitRef.current,
            );
          case "pull":
            return handlePull(
              p,
              playerX,
              playerY,
              playerState,
              onHitRef.current,
              onPullPlayerRef.current,
            );
          case "rain":
            return handleRain(p, playerX, playerState, onHitRef.current);
        }
      });
    }, 20);

    return () => clearInterval(interval);
  }, [projectile, playerX, playerY, playerState, setProjectile, hitstopRef]);
}

function handleCommon(
  p: ProjectileCommon,
  playerX: number,
  playerY: number,
  playerState: playerState,
  onHit: () => void,
): ProjectileCommon | null {
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

  const dx = Math.abs(playerX - next.x);
  const isDashing = playerState === "dash";
  const isCrouched =
    playerState === "idleCrounched" || playerState === "walkCrounched";
  const dodgeProjectile = isDashing || isCrouched;

  const hitY = isCrouched ? playerY - 30 : playerY;
  const hitDy = Math.abs(hitY - next.y);

  if (dx < 40 && hitDy <= 120 && !dodgeProjectile) {
    onHit();
    return null;
  }

  return next;
}

function handlePull(
  p: ProjectilePull,
  playerX: number,
  playerY: number,
  playerState: playerState,
  onHit: () => void,
  onPullPlayer?: (x: number) => void,
): ProjectilePull | null {
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

  const dx = Math.abs(playerX - next.x);
  const isDashing = playerState === "dash";
  const isCrouched =
    playerState === "idleCrounched" || playerState === "walkCrounched";
  const dodgeProjectile = isDashing || isCrouched;

  const hitY = isCrouched ? playerY - 30 : playerY;
  const hitDy = Math.abs(hitY - next.y);

  if (dx < 40 && hitDy <= 120 && !dodgeProjectile) {
    onPullPlayer?.(p.pullTargetX);
    onHit();
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
