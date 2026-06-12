import { useRef, useEffect, useMemo, type MutableRefObject } from "react";
import type { Player } from "@/utils/types/player/player";
import type { BattleMapConfig } from "@/utils/types/battleMap";
import
{
  moveLeftBattle,
  moveRightBattle,
  blockStart,
  blockEnd,
  idleBattle
} from "@/gameRules/movement/battle";

import { canJump } from "@/gameRules/movement/state";
import { isHorizontallyBlocked, getLandingY, getGroundAtX } from "@/utils/types/battleMap";

export type CollisionParams = {
  map: BattleMapConfig | null;
  TILE_SIZE: number;
  scaleX: number;
  scaleY: number;
};

const PLAYER_COLLISION_W = 30;
const PLAYER_COLLISION_H = 50;

export function useBattleMovement(
  setPlayer: React.Dispatch<React.SetStateAction<Player>>,
  collisionRef: MutableRefObject<CollisionParams>,
) {
  const leftIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const rightIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const idleTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const downLockRef = useRef(false);
  const isJumping = useRef(false);
  const hasDoubleJumped = useRef(false);

  const gravity = 1.2;
  const jumpForce = -15;

  const idleTimeout = useMemo(() => idleTimeoutRef.current, []);
  useEffect(() => {
    const left = leftIntervalRef.current;
    const right = rightIntervalRef.current;
    const timeout = idleTimeout;
    return () => {
      if (left) clearInterval(left);
      if (right) clearInterval(right);
      if (timeout) clearTimeout(timeout);
    };
  }, [idleTimeout]);

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
  }, [setPlayer, collisionRef]);

  function checkHorizontalBlock(p: Player): boolean {
    const { map } = collisionRef.current;
    if (!map || map.obstacles.length === 0) return false;

    if (p.velY > 0) return false;

    const playerLeft = p.x - PLAYER_COLLISION_W / 2;
    const playerTop = p.y - PLAYER_COLLISION_H;
    const playerRight = p.x + PLAYER_COLLISION_W / 2;
    const playerBottom = p.y;

    return isHorizontallyBlocked(
      playerLeft, playerTop, playerRight, playerBottom,
      map.obstacles,
    );
  }

  function startMoveLeft() {
    if (leftIntervalRef.current) return;

    leftIntervalRef.current = setInterval(() => {
      setPlayer((p) => {
        const moved = moveLeftBattle(p);
        if (checkHorizontalBlock(moved)) return p;
        return moved;
      });
    }, 30);
  }

  function stopMoveLeft() {
    if (leftIntervalRef.current) {
      clearInterval(leftIntervalRef.current);
      leftIntervalRef.current = null;
    }
    setIdleIfNotMoving();
  }

  function startMoveRight() {
    if (rightIntervalRef.current) return;

    rightIntervalRef.current = setInterval(() => {
      setPlayer((p) => {
        const moved = moveRightBattle(p);
        if (checkHorizontalBlock(moved)) return p;
        return moved;
      });
    }, 30);
  }

  function stopMoveRight() {
    if (rightIntervalRef.current) {
      clearInterval(rightIntervalRef.current);
      rightIntervalRef.current = null;
    }
    setIdleIfNotMoving();
  }

  function setIdleIfNotMoving() {
    if (!leftIntervalRef.current && !rightIntervalRef.current) {
      setPlayer((p) => idleBattle(p));
    }
  }

  function moveUpBattle() {
    if (!canJump(isJumping.current)) return;

    setPlayer((p) => {
      const isMarshadow = p.character === "marcelo";

      if (p.y === p.groundY) {
        hasDoubleJumped.current = false;
        return { ...p, state: "preJump" };
      }

      if (!isMarshadow || hasDoubleJumped.current) return p;
      hasDoubleJumped.current = true;
      return { ...p, velY: jumpForce, state: "jump" };
    });

    setTimeout(() => {
      setPlayer((p) => {
        if (p.y !== p.groundY) return p;
        return { ...p, velY: jumpForce, state: "jump" };
      });
    }, 120);
  }

  function moveDownBattle() {
    if (downLockRef.current) return;
    downLockRef.current = true;
    setPlayer((p) => blockStart(p));
  }

  function releaseDownBattle() {
    if (!downLockRef.current) return;
    downLockRef.current = false;
    setPlayer((p) => blockEnd(p));
  }

  function attack() {
    setPlayer((p) => {
      if (p.state !== "idle") return p;
      return { ...p, state: "preAttack" };
    });
  }

  function special() {
    setPlayer((p) => {
      if (p.state !== "idle") return p;
      return { ...p, state: "preSpecial" };
    });
  }

  return {
    moveUpBattle,
    startMoveLeft,
    stopMoveLeft,
    startMoveRight,
    stopMoveRight,
    moveDownBattle,
    releaseDownBattle,
    attack,
    special,
  };
}
