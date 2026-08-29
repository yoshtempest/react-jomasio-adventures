import { useCallback, useEffect, useRef, useState } from "react";

export const SPECIAL_INTRO_DURATION = 3000;
export const SPECIAL_INTRO_TIME_SCALE = 0.05;

type Props = {
  setTimeScale: (scale: number) => void;
  resetTimeScale: () => void;
};

/**
 * Animação de abertura do special: durante `SPECIAL_INTRO_DURATION` o tempo
 * da batalha fica em `SPECIAL_INTRO_TIME_SCALE` e o overlay do personagem é
 * exibido. Ao final, o tempo volta ao normal e a ação do special é ativada.
 */
export function useSpecialIntro({ setTimeScale, resetTimeScale }: Props) {
  const [specialIntro, setSpecialIntro] = useState<{ character: string } | null>(
    null,
  );
  const activeRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onActivateRef = useRef<(() => void) | null>(null);

  const startSpecialIntro = useCallback(
    (character: string, onActivate: () => void) => {
      if (activeRef.current) return;

      activeRef.current = true;
      onActivateRef.current = onActivate;
      setSpecialIntro({ character });
      setTimeScale(SPECIAL_INTRO_TIME_SCALE);

      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        timerRef.current = null;
        activeRef.current = false;

        const activate = onActivateRef.current;
        onActivateRef.current = null;

        setSpecialIntro(null);
        resetTimeScale();
        activate?.();
      }, SPECIAL_INTRO_DURATION);
    },
    [setTimeScale, resetTimeScale],
  );

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = null;
      resetTimeScale();
    };
  }, [resetTimeScale]);

  return {
    specialIntroActive: specialIntro !== null,
    specialIntroCharacter: specialIntro?.character ?? null,
    startSpecialIntro,
  };
}