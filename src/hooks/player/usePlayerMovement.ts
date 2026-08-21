import { useRef, useEffect } from "react";
import {
  moveExplore,
  EXPLORE_MOVE_INTERVAL,
} from "@/gameRules/movement/explore";
import { useSoundEffects } from "@/contexts/SoundEffectsContext";
import { useLatestRef } from "@/hooks/useLatestRef";

function useMovementInterval(step: () => void) {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function start() {
    if (intervalRef.current) return;
    intervalRef.current = setInterval(step, EXPLORE_MOVE_INTERVAL);
  }

  function stop() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return { start, stop };
}

export function usePlayerMovement(
  currentMap: number[][],
  currentHeightMap: number[][],
  player: Player,
  setPlayer: React.Dispatch<React.SetStateAction<Player>>,
) {
  const { playSound } = useSoundEffects();
  const playSoundRef = useLatestRef(playSound);

  const playerRef = useLatestRef(player);
  const currentMapRef = useLatestRef(currentMap);
  const currentHeightMapRef = useLatestRef(currentHeightMap);

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

  const up = useMovementInterval(() => attemptMove("up"));
  const down = useMovementInterval(() => attemptMove("down"));
  const left = useMovementInterval(() => attemptMove("left"));
  const right = useMovementInterval(() => attemptMove("right"));

  function clearAllIntervals() {
    up.stop();
    down.stop();
    left.stop();
    right.stop();
  }

  return {
    moveUp,
    moveDown,
    moveLeft,
    moveRight,
    startMoveUpExplore: up.start,
    stopMoveUpExplore: up.stop,
    startMoveDownExplore: down.start,
    stopMoveDownExplore: down.stop,
    startMoveLeftExplore: left.start,
    stopMoveLeftExplore: left.stop,
    startMoveRightExplore: right.start,
    stopMoveRightExplore: right.stop,
    clearAllIntervals,
  };
}
