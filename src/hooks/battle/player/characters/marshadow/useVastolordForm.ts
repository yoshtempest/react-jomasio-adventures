import { useCallback, useEffect, useRef, useState } from "react";
import { useLatestRef } from "@/hooks/useLatestRef";

export const VASTOLORD_MULTIPLIER = 4;
export const VASTOLORD_DURATION_MS = 10_000;
const VASTOLORD_TICK_MS = 100;

type Props = {
  enabled: boolean;
  durationMs: number;
  /** Pausa a contagem enquanto a batalha estiver pausada. */
  isPausedRef?: React.RefObject<boolean>;
  /** Aponta para o `isEnding` da batalha; para de contar quando ela acaba. */
  isEndingRef?: React.RefObject<{ current: boolean }>;
  onExpire: () => void;
};

export type VastolordFormApi = {
  vastolordActive: boolean;
  vastolordRemainingMs: number;
  triggerVastolord: () => void;
  resetVastolord: () => void;
};

/**
 * Passiva do marcelo: ao morrer, desperta a Forma Vastolord por `durationMs`.
 * A barra de vida volta a 100%, dano e armadura multiplicam por 4 e, se o
 * inimigo não for derrotado dentro do prazo, o jogador perde a batalha.
 */
export function useVastolordForm({
  enabled,
  durationMs,
  isPausedRef,
  isEndingRef,
  onExpire,
}: Props): VastolordFormApi {
  const [vastolordActive, setVastolordActive] = useState(false);
  const [vastolordRemainingMs, setVastolordRemainingMs] = useState(0);
  const remainingRef = useRef(0);
  const onExpireRef = useLatestRef(onExpire);

  const triggerVastolord = useCallback(() => {
    if (!enabled) return;
    remainingRef.current = durationMs;
    setVastolordRemainingMs(durationMs);
    setVastolordActive(true);
  }, [enabled, durationMs]);

  const resetVastolord = useCallback(() => {
    remainingRef.current = 0;
    setVastolordRemainingMs(0);
    setVastolordActive(false);
  }, []);

  useEffect(() => {
    if (!vastolordActive) return;

    const interval = window.setInterval(() => {
      if (isPausedRef?.current || isEndingRef?.current.current) return;
      if (remainingRef.current <= 0) return;
      const next = Math.max(0, remainingRef.current - VASTOLORD_TICK_MS);
      remainingRef.current = next;
      setVastolordRemainingMs(next);

      if (next <= 0) {
        setVastolordActive(false);
        onExpireRef.current();
      }
    }, VASTOLORD_TICK_MS);

    return () => window.clearInterval(interval);
  }, [vastolordActive, isPausedRef, isEndingRef, onExpireRef]);

  return {
    vastolordActive,
    vastolordRemainingMs,
    triggerVastolord,
    resetVastolord,
  };
}
