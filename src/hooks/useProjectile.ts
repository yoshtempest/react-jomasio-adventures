import { useEffect } from "react";
import type { Projectile } from "@/utils/types/projectile";
import type { Dispatch, SetStateAction } from "react";
import { isFacingTarget } from "@/gameRules/battle/direction";
import type { DirectionBattle } from "@/utils/types/player/player";

export function useProjectile(
  projectile: Projectile | null,
  setProjectile: Dispatch<SetStateAction<Projectile | null>>,
  playerX: number,
  playerY: number,
  playerState: string,
  playerDirection: DirectionBattle,
  npcX: number,
  npcY: number,
  onHit: () => void
) {
  useEffect(() => {
    if (!projectile) return;

    const interval = setInterval(() => {
      setProjectile((p) => {
        if (!p) return null;

        const dx = p.targetX - p.x;
        const dy = p.targetY - p.y;

        const dist = Math.sqrt(dx * dx + dy * dy);

        const speed = 11;

        const next = {
          ...p,
          x: p.x + (dx / dist) * speed,
          y: p.y + (dy / dist) * speed,
        };

        const distanceToPlayer = Math.sqrt(
          (playerX - next.x) ** 2 +
          (playerY - next.y) ** 2
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

        const passedTarget =
          (dx > 0 && next.x >= p.targetX) ||
          (dx < 0 && next.x <= p.targetX);

        if (passedTarget) {
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