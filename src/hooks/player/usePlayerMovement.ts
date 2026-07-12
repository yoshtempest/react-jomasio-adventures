import { useRef, useEffect } from "react";
import { moveExplore } from "@/gameRules/movement/explore";

const EXPLORE_MOVE_INTERVAL = 200;

export function usePlayerMovement(
  currentMap: number[][],
  setPlayer: React.Dispatch<React.SetStateAction<Player>>,
) {
  const upIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const downIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const leftIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const rightIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (upIntervalRef.current) clearInterval(upIntervalRef.current);
      if (downIntervalRef.current) clearInterval(downIntervalRef.current);
      if (leftIntervalRef.current) clearInterval(leftIntervalRef.current);
      if (rightIntervalRef.current) clearInterval(rightIntervalRef.current);
    };
  }, []);

  function moveUp() {
    setPlayer((p) => moveExplore(p, currentMap, "up"));
  }

  function moveDown() {
    setPlayer((p) => moveExplore(p, currentMap, "down"));
  }

  function moveLeft() {
    setPlayer((p) => moveExplore(p, currentMap, "left"));
  }

  function moveRight() {
    setPlayer((p) => moveExplore(p, currentMap, "right"));
  }

  function startMoveUpExplore() {
    if (upIntervalRef.current) return;
    upIntervalRef.current = setInterval(() => {
      setPlayer((p) => moveExplore(p, currentMap, "up"));
    }, EXPLORE_MOVE_INTERVAL);
  }

  function stopMoveUpExplore() {
    if (upIntervalRef.current) {
      clearInterval(upIntervalRef.current);
      upIntervalRef.current = null;
    }
  }

  function startMoveDownExplore() {
    if (downIntervalRef.current) return;
    downIntervalRef.current = setInterval(() => {
      setPlayer((p) => moveExplore(p, currentMap, "down"));
    }, EXPLORE_MOVE_INTERVAL);
  }

  function stopMoveDownExplore() {
    if (downIntervalRef.current) {
      clearInterval(downIntervalRef.current);
      downIntervalRef.current = null;
    }
  }

  function startMoveLeftExplore() {
    if (leftIntervalRef.current) return;
    leftIntervalRef.current = setInterval(() => {
      setPlayer((p) => moveExplore(p, currentMap, "left"));
    }, EXPLORE_MOVE_INTERVAL);
  }

  function stopMoveLeftExplore() {
    if (leftIntervalRef.current) {
      clearInterval(leftIntervalRef.current);
      leftIntervalRef.current = null;
    }
  }

  function startMoveRightExplore() {
    if (rightIntervalRef.current) return;
    rightIntervalRef.current = setInterval(() => {
      setPlayer((p) => moveExplore(p, currentMap, "right"));
    }, EXPLORE_MOVE_INTERVAL);
  }

  function stopMoveRightExplore() {
    if (rightIntervalRef.current) {
      clearInterval(rightIntervalRef.current);
      rightIntervalRef.current = null;
    }
  }

  return {
    moveUp, moveDown, moveLeft, moveRight,
    startMoveUpExplore, stopMoveUpExplore,
    startMoveDownExplore, stopMoveDownExplore,
    startMoveLeftExplore, stopMoveLeftExplore,
    startMoveRightExplore, stopMoveRightExplore,
  };
}
