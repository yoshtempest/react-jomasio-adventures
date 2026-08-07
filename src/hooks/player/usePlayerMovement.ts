import { useRef, useEffect } from "react";
import { moveExplore, EXPLORE_MOVE_INTERVAL } from "@/gameRules/movement/explore";
import { useSoundEffects } from "@/contexts/SoundEffectsContext";

export function usePlayerMovement(
  currentMap: number[][],
  currentHeightMap: number[][],
  player: Player,
  setPlayer: React.Dispatch<React.SetStateAction<Player>>,
) {
  const { playSound } = useSoundEffects();
  const playSoundRef = useRef(playSound);
  playSoundRef.current = playSound;

  const upIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const downIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const leftIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const rightIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const playerRef = useRef(player);
  playerRef.current = player;
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

  function attemptMove(direction: Direction) {
    const result = moveExplore(
      playerRef.current,
      currentMapRef.current,
      direction,
      currentHeightMapRef.current,
    );
    if (result.blocked) {
      playSoundRef.current("cantMove");
    }
    setPlayer(result.player);
  }

  function moveUp() {
    attemptMove("up");
  }

  function moveDown() {
    attemptMove("down");
  }

  function moveLeft() {
    attemptMove("left");
  }

  function moveRight() {
    attemptMove("right");
  }

  function startMoveUpExplore() {
    if (upIntervalRef.current) return;
    upIntervalRef.current = setInterval(() => {
      attemptMove("up");
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
      attemptMove("down");
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
      attemptMove("left");
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
      attemptMove("right");
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
