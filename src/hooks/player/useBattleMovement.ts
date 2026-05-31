import { useRef, useEffect } from "react";
import type { Player } from "@/utils/types/player/player";
import
{
  moveLeftBattle,
  moveRightBattle,
  blockStart,
  blockEnd,
  idleBattle
} from "@/gameRules/movement/battle";

import { canJump } from "@/gameRules/movement/state";


export function useBattleMovement(
  setPlayer: React.Dispatch<React.SetStateAction<Player>>
) {

  const leftIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const rightIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const idleTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const downLockRef = useRef(false);
  const isJumping = useRef(false);

  const gravity = 1.2;
  const jumpForce = -15;

  useEffect(() => {
    return () => {
      if (leftIntervalRef.current) clearInterval(leftIntervalRef.current);
      if (rightIntervalRef.current) clearInterval(rightIntervalRef.current);
      if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlayer((p) => {
        // só aplica física se estiver no ar
        if (p.y === p.groundY && p.velY === 0) return p;

        let newVelY = p.velY + gravity;
        let newY = p.y + newVelY;

        // 🧱 colisão com o chão
        if (newY >= p.groundY) {
          newY = p.groundY;
          newVelY = 0;

          return {
            ...p,
            y: newY,
            velY: newVelY,
            state: "idle",
          };
        }

        return {
          ...p,
          y: newY,
          velY: newVelY,
          state: "jump",
        };
      });
    }, 16); // ~60fps

    return () => clearInterval(interval);
  }, []);

  function startMoveLeft() {
    if (leftIntervalRef.current) return;

    leftIntervalRef.current = setInterval(() => {
      setPlayer((p) => moveLeftBattle(p));
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
      setPlayer((p) => moveRightBattle(p));
    }, 30);
  }

  function stopMoveRight() {
    if (rightIntervalRef.current) {
      clearInterval(rightIntervalRef.current);
      rightIntervalRef.current = null;
    }

    setIdleIfNotMoving();
  }

  // ✅ evita conflito entre esquerda/direita
  function setIdleIfNotMoving() {
    if (!leftIntervalRef.current && !rightIntervalRef.current) {
      setPlayer((p) => idleBattle(p));
    }
  }

  function moveUpBattle() {
    if (!canJump(isJumping.current)) return;

    setPlayer((p) => {
      if (p.y !== p.groundY) return p;

      return {
        ...p,
        state: "preJump",
      };
    });

    setTimeout(() => {
      setPlayer((p) => {
        if (p.y !== p.groundY) return p;

        return {
          ...p,
          velY: jumpForce,
          state: "jump",
        };
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

      return {
        ...p,
        state: "preAttack",
      };
    });
  }

  function special() {
    setPlayer((p) => {
      if (p.state !== "idle") return p;

      return {
        ...p,
        state: "preSpecial",
      };
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