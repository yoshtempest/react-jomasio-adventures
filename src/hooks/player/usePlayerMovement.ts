import { useRef, useEffect } from "react";
import { moveExplore, EXPLORE_MOVE_INTERVAL } from "@/gameRules/movement/explore";

export function usePlayerMovement(
  currentMap: number[][],
  currentHeightMap: number[][],
  setPlayer: React.Dispatch<React.SetStateAction<Player>>,
) {
  const upIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const downIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const leftIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const rightIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const currentMapRef = useRef(currentMap);
  currentMapRef.current = currentMap;
  const currentHeightMapRef = useRef(currentHeightMap);
  currentHeightMapRef.current = currentHeightMap;

  useEffect(() => {
    return () => {
      if (upIntervalRef.current) clearInterval(upIntervalRef.current);
      if (downIntervalRef.current) clearInterval(downIntervalRef.current);
      if (leftIntervalRef.current) clearInterval(leftIntervalRef.current);
      if (rightIntervalRef.current) clearInterval(rightIntervalRef.current);
    };
  }, []);

  function moveUp() {
    setPlayer((p) => moveExplore(p, currentMapRef.current, "up", currentHeightMapRef.current));
  }

  function moveDown() {
    setPlayer((p) => moveExplore(p, currentMapRef.current, "down", currentHeightMapRef.current));
  }

  function moveLeft() {
    setPlayer((p) => moveExplore(p, currentMapRef.current, "left", currentHeightMapRef.current));
  }

  function moveRight() {
    setPlayer((p) => moveExplore(p, currentMapRef.current, "right", currentHeightMapRef.current));
  }

  function startMoveUpExplore() {
    if (upIntervalRef.current) return;
    upIntervalRef.current = setInterval(() => {
      setPlayer((p) => moveExplore(p, currentMapRef.current, "up", currentHeightMapRef.current));
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
      setPlayer((p) => moveExplore(p, currentMapRef.current, "down", currentHeightMapRef.current));
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
      setPlayer((p) => moveExplore(p, currentMapRef.current, "left", currentHeightMapRef.current));
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
      setPlayer((p) => moveExplore(p, currentMapRef.current, "right", currentHeightMapRef.current));
    }, EXPLORE_MOVE_INTERVAL);
  }

  function stopMoveRightExplore() {
    if (rightIntervalRef.current) {
      clearInterval(rightIntervalRef.current);
      rightIntervalRef.current = null;
    }
  }

  function clearAllIntervals() {
    if (upIntervalRef.current) {
      clearInterval(upIntervalRef.current);
      upIntervalRef.current = null;
    }
    if (downIntervalRef.current) {
      clearInterval(downIntervalRef.current);
      downIntervalRef.current = null;
    }
    if (leftIntervalRef.current) {
      clearInterval(leftIntervalRef.current);
      leftIntervalRef.current = null;
    }
    if (rightIntervalRef.current) {
      clearInterval(rightIntervalRef.current);
      rightIntervalRef.current = null;
    }
  }

  return {
    moveUp,
    moveDown,
    moveLeft,
    moveRight,
    startMoveUpExplore,
    stopMoveUpExplore,
    startMoveDownExplore,
    stopMoveDownExplore,
    startMoveLeftExplore,
    stopMoveLeftExplore,
    startMoveRightExplore,
    stopMoveRightExplore,
    clearAllIntervals,
  };
}
