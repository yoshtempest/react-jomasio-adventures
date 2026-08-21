import { useEffect, useRef, type RefObject } from "react";
import { getLandingY, getGroundAtX } from "@/gameRules/battle/obstacles";
import type { CollisionParams } from "@/utils/types/battle/collision";

export type { CollisionParams };

const gravity = 1;

export function useBattleGravity(
  setPlayer: React.Dispatch<React.SetStateAction<Player>>,
  collisionRef: RefObject<CollisionParams>,
  hasDoubleJumped: RefObject<boolean>,
  hasUsedFallingAttack?: RefObject<boolean>,
  playerModeRef?: RefObject<PlayerMode>,
) {
  const playerModeInternalRef = useRef(playerModeRef?.current ?? "explore");
  if (playerModeRef) playerModeInternalRef.current = playerModeRef.current;

  useEffect(() => {
    const interval = setInterval(() => {
      if (playerModeInternalRef.current === "menu") return;

      setPlayer((p) => {
        if (p.throwStartTime > 0) {
          return { ...p, velY: 0, state: "fallen" };
        }

        if (p.state === "fallingAttack") {
          return { ...p, velY: 0 };
        }

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
            if (hasUsedFallingAttack) hasUsedFallingAttack.current = false;
            const wasAirborne =
              p.state === "jump" ||
              p.state === "preJump" ||
              p.state === "falling";
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
            if (hasUsedFallingAttack) hasUsedFallingAttack.current = false;
            const wasAirborne =
              p.state === "jump" ||
              p.state === "preJump" ||
              p.state === "falling";
            return {
              ...p,
              y: p.groundY,
              velY: 0,
              state: wasAirborne ? "idle" : p.state,
            };
          }
        }

        const isAirSpecial =
          p.state === "preSpecialInAir" ||
          p.state === "specialInAir" ||
          p.state === "specialInAirFinish";
        return {
          ...p,
          y: newY,
          velY: newVelY,
          state: isAirSpecial
            ? p.state
            : newVelY > 0
              ? "falling"
              : p.state === "preJump"
                ? "preJump"
                : "jump",
        };
      });
    }, 16);

    return () => clearInterval(interval);
  }, [
    setPlayer,
    collisionRef,
    hasDoubleJumped,
    hasUsedFallingAttack,
    playerModeRef,
  ]);
}
