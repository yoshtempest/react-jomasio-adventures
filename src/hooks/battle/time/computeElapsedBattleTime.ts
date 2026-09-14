import type { RefObject } from "react";

export function computeElapsedBattleTime(
  battleStartRef: RefObject<number>,
  prevModeRef: RefObject<PlayerMode>,
  pauseStartRef: RefObject<number>,
  pauseDurationRef: RefObject<number>,
): number {
  let elapsed = Date.now() - battleStartRef.current;
  if (prevModeRef.current === "menu") {
    elapsed += Date.now() - pauseStartRef.current;
  }
  elapsed -= pauseDurationRef.current;
  return elapsed;
}