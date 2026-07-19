import { useEffect, useRef } from "react";
import { usePlayer } from "@/contexts/PlayerContext";
import { useCharacterProgress } from "@/contexts/CharacterProgressContext";
import {
  DIFFICULTY_HUNGER_RATE,
  HUNGER_INTERVAL_MS,
  HUNGER_TICK_MS,
} from "@/data/player/hunger";

export function useHungerTimer() {
  const { difficulty, player } = usePlayer();
  const { reduceHunger } = useCharacterProgress();
  const accumulatedRef = useRef(0);

  useEffect(() => {
    const rate = DIFFICULTY_HUNGER_RATE[difficulty];
    if (!rate || rate === 0) return;

    const interval = setInterval(() => {
      accumulatedRef.current += HUNGER_TICK_MS;
      const slots = Math.floor(accumulatedRef.current / HUNGER_INTERVAL_MS);
      if (slots > 0) {
        reduceHunger(player.character, Math.abs(rate) * slots);
        accumulatedRef.current -= slots * HUNGER_INTERVAL_MS;
      }
    }, HUNGER_TICK_MS);

    return () => {
      clearInterval(interval);
      accumulatedRef.current = 0;
    };
  }, [difficulty, player.character, reduceHunger]);
}
