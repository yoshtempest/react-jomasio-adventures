import { useCallback, useEffect, useRef, useState } from "react";
import { ONE_THOUSAND_MS } from "@/data/ms";
import type { MarceloBattleForm } from "@/utils/paths";

export const SPECIAL_INTRO_DURATION = ONE_THOUSAND_MS;
export const SPECIAL_INTRO_TIME_SCALE = 0.1;

type Props = {
  setTimeScale: (scale: number) => void;
  resetTimeScale: () => void;
};

/**
 * Animação de abertura do special: durante `SPECIAL_INTRO_DURATION` o tempo
 * da batalha fica em `SPECIAL_INTRO_TIME_SCALE` e o overlay do personagem é
 * exibido. Ao final, o tempo volta ao normal e a ação do special é ativada.
 * A duração casa com a animação CSS do SpecialIntro (fade-in 2s + fade-out
 * rápido), que roda em tempo real independente do time scale.
 *
 * `startSpecialIntro` devolve `false` quando já existe um intro em andamento
 * (o `onActivate` passado nunca roda). Quem consome o retorno precisa então
 * executar a ação por conta própria — do contrário a habilidade some junto com
 * o recurso que ela consumiu no `press`.
 */
export function useSpecialIntro({ setTimeScale, resetTimeScale }: Props) {
  const [specialIntro, setSpecialIntro] = useState<{
    character: string;
    ability?: string;
    form?: MarceloBattleForm;
  } | null>(null);
  const activeRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onActivateRef = useRef<(() => void) | null>(null);

  const startSpecialIntro = useCallback(
    (
      character: string,
      onActivate: () => void,
      ability?: string,
      form?: MarceloBattleForm,
    ) => {
      if (activeRef.current) return false;

      activeRef.current = true;
      onActivateRef.current = onActivate;
      setSpecialIntro({ character, ability, form });
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

      return true;
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
    specialIntroAbility: specialIntro?.ability ?? null,
    specialIntroForm: specialIntro?.form ?? null,
    startSpecialIntro,
  };
}
