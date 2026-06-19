import { useEffect, useRef } from "react";
import type { Dispatch, SetStateAction } from "react";

export function useProjectile(
  projectile: Projectile | null,
  setProjectile: Dispatch<SetStateAction<Projectile | null>>,
  playerX: number,
  playerY: number,
  playerState: playerState,
  playerDirection: Direction,
  npcX: number,
  npcY: number,
  onHit: () => void,
  hitstopRef: React.RefObject<number>,
) {
  const onHitRef = useRef(onHit);
  onHitRef.current = onHit;

  useEffect(() => {
    if (!projectile) return;

    const interval = setInterval(() => {
      if (hitstopRef.current > Date.now()) return;
      setProjectile((p) => {
        if (!p) return null;

        const now = Date.now();

        if (p.state === "walk") {
          if (now - p.createdAt >= 500) {
            return {
              ...p,
              state: "idle",
            };
          }

          return p;
        }

        const speed = 11;

        const next = {
          ...p,
          x: p.x + p.dirX * speed,
          y: p.y + p.dirY * speed,
        };

        const OFFSCREEN_MARGIN = 200;
        const MAP_WIDTH = 1280;
        const MAP_HEIGHT = 600;

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
          onHitRef.current();
          return null;
        }

        return next;
      });
    }, 20);

    return () => clearInterval(interval);
  }, [
    projectile,
    playerX,
    playerY,
    npcX,
    npcY,
    playerState,
    playerDirection,
    setProjectile,
    hitstopRef,
  ]);
}
