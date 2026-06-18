import { useEffect, type MutableRefObject } from "react";
import type { BattleMapConfig } from "@/utils/types/maps/battle";
import { getLandingY, getGroundAtX } from "@/utils/types/maps/battle";

export type CollisionParams = {
  map: BattleMapConfig | null;
  TILE_SIZE: number;
  scaleX: number;
  scaleY: number;
};

const gravity = 1.2;

export function useBattleGravity(
  setPlayer: React.Dispatch<React.SetStateAction<Player>>,
  collisionRef: MutableRefObject<CollisionParams>,
  hasDoubleJumped: MutableRefObject<boolean>,
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
            const wasAirborne = p.state === "jump" || p.state === "preJump";
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
            const wasAirborne = p.state === "jump" || p.state === "preJump";
            return {
              ...p,
              y: p.groundY,
              velY: 0,
              state: wasAirborne ? "idle" : p.state,
            };
          }
        }

        return { ...p, y: newY, velY: newVelY, state: "jump" };
      });
    }, 16);

    return () => clearInterval(interval);
  }, [setPlayer, collisionRef, hasDoubleJumped]);
}
