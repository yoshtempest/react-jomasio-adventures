import { useEffect } from "react";
import type { Projectile } from "@/utils/types/projectile";
import type { Dispatch, SetStateAction } from "react";
import { isFacingTarget } from "@/gameRules/battle/direction";

export function useProjectile(
  projectile: Projectile | null,
  setProjectile: Dispatch<SetStateAction<Projectile | null>>,
  playerX: number,
  playerY: number,
  playerState: playerState,
  playerDirection: Direction,
  npcX: number,
  npcY: number,
  onHit: () => void
) {
  useEffect(() => {
    if (!projectile) return;

    const interval = setInterval(() => {
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

            return p; // continua parado
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

        const distanceToPlayer = Math.hypot(
          playerX - next.x,
          playerY - next.y
        );

        const isCloseEnough = distanceToPlayer < 30;
        const yDiff = Math.abs(playerY - next.y);
        const isSameLane = yDiff <= 40; // 🎯 tolerância
        const isBlocking =
          playerState === "blocked" &&
          isFacingTarget(playerX, playerY, npcX, npcY, playerDirection);

        if (isCloseEnough && isSameLane && !isBlocking) {
          onHit();
          return null;
        }

        if (isCloseEnough) {
          return null;
        }

        return next;
      });
    }, 20);

    return () => clearInterval(interval);
  },
  [
    projectile,
    playerX,
    playerY,
    playerState
  ]);
}