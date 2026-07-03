import { useEffect, type RefObject } from "react";
import { getLandingY, getGroundAtX } from "@/utils/types/maps/battle";
import type { CollisionParams } from "@/utils/types/battle/collision";

export type { CollisionParams };

const gravity = 1.5;

export function useBattleGravity(
  setPlayer: React.Dispatch<React.SetStateAction<Player>>,
  collisionRef: RefObject<CollisionParams>,
  hasDoubleJumped: RefObject<boolean>,
) {
  useEffect(() => {
    const interval = setInterval(() => {
      setPlayer((p) => {
        const { map } = collisionRef.current;
        const obstacles = map?.obstacles ?? [];

        const prevY = p.y;
        const newVelY = p.velY + gravity;
        const newY = p.y + newVelY;

        if (obstacles.length > 0) {
          const groundBelow = getGroundAtX(p.y + 2, p.x, obstacles);

          if (p.velY === 0 && p.y === groundBelow) {
            return { ...p, groundY: groundBelow };
          }

          const landingY = getLandingY(prevY, newY, p.x, obstacles);

          if (newY >= landingY) {
            hasDoubleJumped.current = false;
            const wasAirborne = p.state === "jump" || p.state === "preJump" || p.state === "falling";
            return {
              ...p,
              y: landingY,
              velY: 0,
              groundY: landingY,
              state: wasAirborne ? "idle" : p.state,
            };
          }
        } else {
          if (newY >= p.groundY) {
            hasDoubleJumped.current = false;
            const wasAirborne = p.state === "jump" || p.state === "preJump" || p.state === "falling";
            return {
              ...p,
              y: p.groundY,
              velY: 0,
              state: wasAirborne ? "idle" : p.state,
            };
          }
        }

        return { ...p, y: newY, velY: newVelY, state: newVelY > 0 ? "falling" : "jump" };
      });
    }, 16);

    return () => clearInterval(interval);
  }, [setPlayer, collisionRef, hasDoubleJumped]);
}
