import { useEffect, useRef } from "react";
import { usePlayer } from "@/contexts/PlayerContext";
import { useCharacterProgress } from "@/contexts/CharacterProgressContext";
import {
  DIFFICULTY_SLEEP_RATE,
  SLEEP_INTERVAL_MS,
  SLEEP_TICK_MS,
} from "@/data/player/sleep";

export function useSleepTimer() {
  const { difficulty, player } = usePlayer();
  const { reduceSleep } = useCharacterProgress();
  const accumulatedRef = useRef(0);

  useEffect(() => {
    const rate = DIFFICULTY_SLEEP_RATE[difficulty];
    if (!rate || rate === 0) return;

    const interval = setInterval(() => {
      accumulatedRef.current += SLEEP_TICK_MS;
      const slots = Math.floor(accumulatedRef.current / SLEEP_INTERVAL_MS);
      if (slots > 0) {
        reduceSleep(player.character, Math.abs(rate) * slots);
        accumulatedRef.current -= slots * SLEEP_INTERVAL_MS;
      }
    }, SLEEP_TICK_MS);

    return () => {
      clearInterval(interval);
      accumulatedRef.current = 0;
    };
  }, [difficulty, player.character, reduceSleep]);
}
