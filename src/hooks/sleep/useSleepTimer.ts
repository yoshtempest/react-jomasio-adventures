import { useEffect, useRef } from "react";
import { usePlayer } from "@/contexts/PlayerContext";
import { useCharacterProgress } from "@/contexts/CharacterProgressContext";
import { useLatestRef } from "@/hooks/useLatestRef";
import {
  DIFFICULTY_SLEEP_RATE,
  SLEEP_INTERVAL_MS,
  SLEEP_TICK_MS,
} from "@/data/player/sleep";

/**
 * Drena o sono do personagem ativo enquanto o jogo está aberto.
 *
 * `reduceSleep` entra por ref e fica fora das dependências do effect.
 * O CharacterProgressProvider recria seus métodos a cada render, então
 * tê-los nas deps reiniciava o intervalo e zerava `accumulatedRef` antes
 * de qualquer tick de 30s completar. Com o regen de HP gravando
 * progresso a cada segundo, o sono simplesmente nunca caía.
 */
export function useSleepTimer() {
  const { difficulty, player } = usePlayer();
  const { reduceSleep } = useCharacterProgress();
  const reduceSleepRef = useLatestRef(reduceSleep);
  const accumulatedRef = useRef(0);

  useEffect(() => {
    const rate = DIFFICULTY_SLEEP_RATE[difficulty];
    if (!rate || rate === 0) return;

    const interval = setInterval(() => {
      accumulatedRef.current += SLEEP_TICK_MS;
      const slots = Math.floor(accumulatedRef.current / SLEEP_INTERVAL_MS);
      if (slots > 0) {
        reduceSleepRef.current(player.character, Math.abs(rate) * slots);
        accumulatedRef.current -= slots * SLEEP_INTERVAL_MS;
      }
    }, SLEEP_TICK_MS);

    return () => {
      clearInterval(interval);
      accumulatedRef.current = 0;
    };
  }, [difficulty, player.character, reduceSleepRef]);
}
