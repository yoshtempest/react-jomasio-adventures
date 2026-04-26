import { useRef, useEffect } from "react";
import type { Player } from "@/utils/types/player/player";
import
{
  moveLeftBattle,
  moveRightBattle,
  jumpBattle,
  landBattle,
  blockStart,
  blockEnd,
  attackBattle,
  specialBattle,
  idleBattle
} from "@/gameRules/movement/battle";

import { canJump } from "@/gameRules/movement/state";


export function useBattleMovement(
  setPlayer: React.Dispatch<React.SetStateAction<Player>>
) {

  const leftIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const rightIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const downLockRef = useRef(false);
  const isJumping = useRef(false);

  // ✅ LIMPEZA AUTOMÁTICA (ESSENCIAL)
  useEffect(() => {
    return () => {
      if (leftIntervalRef.current) clearInterval(leftIntervalRef.current);
      if (rightIntervalRef.current) clearInterval(rightIntervalRef.current);
    };
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
    isJumping.current = true;

    setPlayer((p) => jumpBattle(p));

    setTimeout(() => {
      isJumping.current = false;
      setPlayer((p) => landBattle(p));
    }, 450);
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
    setPlayer((p) => attackBattle(p));
    resetToIdle(250);
  }

  function special() {
    setPlayer((p) => specialBattle(p));
    resetToIdle(800);
  }

  function resetToIdle(delay = 0) {
    setTimeout(() => {
      setPlayer((p) => idleBattle(p));
    }, delay);
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