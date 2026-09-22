import { useCallback, useEffect, useRef, useState } from "react";
import { TWO_HUNDRED_MS, FIVE_THOUSAND_MS } from "@/data/ms";
import { playerPath, asset } from "@/utils/paths";

/** CutInEnemie aparece por 1s sobre o NPC atingido. */
export const MARCELO_CUT_IN_DURATION_MS = TWO_HUNDRED_MS;
/** Duração do sangramento aplicado pelo CutInEnemie do marcelo. */
export const MARCELO_BLEED_DURATION_MS = FIVE_THOUSAND_MS;

/** Sprite de strike do marcelo (forma padrão) sobrepondo o inimigo. */
export const MARCELO_CUT_IN_ENEMIE_SRC = playerPath(
  "/marcelo/inFight/default/attacks/cutInEnemie.svg",
);
/** Ícone de sangrado exibido acima do NPC em status de sangramento. */
export const BLOOD_ICON_SRC = asset("/assets/status/bloodIcon.svg");

export type CutInEnemieOverlay = {
  /** Contador de ativações — vira a chave React para reiniciar o sprite. */
  key: number;
  /** Ângulo aleatório (0 a 90 graus) do strike sobre o NPC. */
  rotation: number;
};

type Props = {
  isEnding: React.RefObject<boolean>;
  /** Aplica o sangramento no NPC (chama o sistema de bleed já existente). */
  applyNpcBleed: (durationMs: number) => void;
};

export function useMarceloCutInEnemie({ isEnding, applyNpcBleed }: Props) {
  const [cutInEnemie, setCutInEnemie] = useState<CutInEnemieOverlay | null>(
    null,
  );
  const [npcBleeding, setNpcBleeding] = useState(false);

  const activationKeyRef = useRef(0);
  const bleedHitsRef = useRef(0);
  const cutInTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const bleedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const trigger = useCallback(() => {
    if (isEnding.current) return;

    // Cada CutInEnemie é uma nova sprite sobre o NPC, com ângulo aleatório.
    activationKeyRef.current += 1;
    setCutInEnemie({
      key: activationKeyRef.current,
      rotation: Math.random() * 90,
    });

    if (cutInTimerRef.current) clearTimeout(cutInTimerRef.current);
    cutInTimerRef.current = setTimeout(
      () => setCutInEnemie(null),
      MARCELO_CUT_IN_DURATION_MS,
    );

    // Chance de sangramento acumula por CutInEnemie no mesmo inimigo:
    // 1° = 1%, 2° = 3%, 3° = 9%, 4° = 27%... (triplica a cada strike).
    bleedHitsRef.current += 1;
    const bleedChance = Math.min(
      1,
      Math.pow(3, bleedHitsRef.current - 1) / 100,
    );
    if (Math.random() >= bleedChance) return;

    applyNpcBleed(MARCELO_BLEED_DURATION_MS);
    setNpcBleeding(true);
    if (bleedTimerRef.current) clearTimeout(bleedTimerRef.current);
    bleedTimerRef.current = setTimeout(
      () => setNpcBleeding(false),
      MARCELO_BLEED_DURATION_MS,
    );
  }, [isEnding, applyNpcBleed]);

  const reset = useCallback(() => {
    bleedHitsRef.current = 0;
    setNpcBleeding(false);
    setCutInEnemie(null);
    if (cutInTimerRef.current) clearTimeout(cutInTimerRef.current);
    if (bleedTimerRef.current) clearTimeout(bleedTimerRef.current);
  }, []);

  useEffect(
    () => () => {
      if (cutInTimerRef.current) clearTimeout(cutInTimerRef.current);
      if (bleedTimerRef.current) clearTimeout(bleedTimerRef.current);
    },
    [],
  );

  return { cutInEnemie, npcBleeding, trigger, reset };
}