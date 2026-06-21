import { useEffect, useRef } from "react";
import type { Dispatch, SetStateAction } from "react";

const SPEED = 20;
const SPEAR_FALL_SPEED = 18;
const OFFSCREEN_MARGIN = 200;
const MAP_WIDTH = 1280;
const MAP_HEIGHT = 600;
const OFFSCREEN_BOTTOM = 800;

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
            return handleCommon(p, playerX, playerY, playerState, onHitRef.current);
          case "pull":
            return handlePull(p, playerX, playerY, playerState, onHitRef.current, onPullPlayerRef.current);
          case "rain":
            return handleRain(p, playerX, playerState, onHitRef.current);
        }
      });
    }, 20);

    return () => clearInterval(interval);
  }, [
    projectile,
    playerX,
    playerY,
    playerState,
    setProjectile,
    hitstopRef,
  ]);
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
    x: p.x + p.dirX * SPEED,
    y: p.y + p.dirY * SPEED,
  };

  if (
    next.x < -OFFSCREEN_MARGIN ||
    next.x > MAP_WIDTH + OFFSCREEN_MARGIN ||
    next.y < -OFFSCREEN_MARGIN ||
    next.y > MAP_HEIGHT + OFFSCREEN_MARGIN
  ) {
    return null;
  }

  const dx = Math.abs(playerX - next.x);
  const dy = Math.abs(playerY - next.y);
  const isDashing = playerState === "dash";

  if (dx < 40 && dy <= 120 && !isDashing) {
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
    x: p.x + p.dirX * SPEED,
    y: p.y + p.dirY * SPEED,
  };

  if (
    next.x < -OFFSCREEN_MARGIN ||
    next.x > MAP_WIDTH + OFFSCREEN_MARGIN ||
    next.y < -OFFSCREEN_MARGIN ||
    next.y > MAP_HEIGHT + OFFSCREEN_MARGIN
  ) {
    return null;
  }

  const dx = Math.abs(playerX - next.x);
  const dy = Math.abs(playerY - next.y);
  const isDashing = playerState === "dash";

  if (dx < 40 && dy <= 120 && !isDashing) {
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
    if (s.hit || s.y > OFFSCREEN_BOTTOM) return s;
    allDone = false;

    const newY = s.y + SPEAR_FALL_SPEED;
    const isDashing = playerState === "dash";

    if (!s.hit && newY >= 550 && newY <= OFFSCREEN_BOTTOM && !isDashing) {
      const dx = Math.abs(playerX - s.x);
      if (dx < 60) {
        onHit();
        return { x: s.x, y: newY, hit: true };
      }
    }

    return { x: s.x, y: newY };
  });

  if (allDone) return null;

  return { ...p, spears: newSpears };
}
