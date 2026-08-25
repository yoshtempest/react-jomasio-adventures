import { useEffect, useRef } from "react";
import { usePlayer } from "@/contexts/PlayerContext";
import { useCharacterProgress } from "@/contexts/CharacterProgressContext";
import { useLatestRef } from "@/hooks/useLatestRef";
import {
  DIFFICULTY_HUNGER_RATE,
  HUNGER_INTERVAL_MS,
  HUNGER_TICK_MS,
} from "@/data/player/hunger";

/**
 * Drena a fome do personagem ativo enquanto o jogo está aberto.
 *
 * `reduceHunger` entra por ref e fica fora das dependências do effect.
 * O CharacterProgressProvider recria seus métodos a cada render, então
 * tê-los nas deps reiniciava o intervalo e zerava `accumulatedRef` antes
 * de qualquer tick de 30s completar. Com o regen de HP gravando
 * progresso a cada segundo, a fome simplesmente nunca caía.
 */
export function useHungerTimer() {
  const { difficulty, player } = usePlayer();
  const { reduceHunger } = useCharacterProgress();
  const reduceHungerRef = useLatestRef(reduceHunger);
  const accumulatedRef = useRef(0);

  useEffect(() => {
    const rate = DIFFICULTY_HUNGER_RATE[difficulty];
    if (!rate || rate === 0) return;

    const interval = setInterval(() => {
      accumulatedRef.current += HUNGER_TICK_MS;
      const slots = Math.floor(accumulatedRef.current / HUNGER_INTERVAL_MS);
      if (slots > 0) {
        reduceHungerRef.current(player.character, Math.abs(rate) * slots);
        accumulatedRef.current -= slots * HUNGER_INTERVAL_MS;
      }
    }, HUNGER_TICK_MS);

    return () => {
      clearInterval(interval);
      accumulatedRef.current = 0;
    };
  }, [difficulty, player.character, reduceHungerRef]);
}
