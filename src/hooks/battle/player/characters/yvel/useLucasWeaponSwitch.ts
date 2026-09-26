import { useCallback, useEffect, useRef, useState } from "react";
import {
  DEFAULT_LUCAS_WEAPON,
  rollNextLucasWeapon,
  type LucasWeapon,
} from "@/data/characters/lucasWeapons";
import { applyHitstop, type TempoEffect } from "@/gameRules/battle/tempo";

export const LUCAS_WEAPON_SWITCH_DURATION_MS = 600;

type Props = {
  character: CharacterId;
  isEndingRef?: React.RefObject<boolean>;
  tempoRef: React.RefObject<TempoEffect[]>;
};

/**
 * Mecânica única do Lucas (Yvel): botão extra que congela a batalha por um
 * instante e troca aleatoriamente para outra arma (nunca a atual, e nunca
 * withBow/arms/withNothing). A troca altera as sprites do personagem.
 */
export function useLucasWeaponSwitch({
  character,
  isEndingRef,
  tempoRef,
}: Props) {
  const [weapon, setWeapon] = useState<LucasWeapon>(DEFAULT_LUCAS_WEAPON);
  const switchingRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const available = character === "lucas";

  const switchWeapon = useCallback(() => {
    if (!available) return;
    if (isEndingRef?.current) return;
    if (switchingRef.current) return;

    switchingRef.current = true;
    tempoRef.current = applyHitstop(tempoRef.current, LUCAS_WEAPON_SWITCH_DURATION_MS);

    const next = rollNextLucasWeapon(weapon);
    setWeapon(next);

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      switchingRef.current = false;
      timerRef.current = null;
    }, LUCAS_WEAPON_SWITCH_DURATION_MS);
  }, [available, isEndingRef, tempoRef, weapon]);

  useEffect(() => {
    if (available) {
      setWeapon(DEFAULT_LUCAS_WEAPON);
    }
  }, [available]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = null;
    };
  }, []);

  return {
    weapon: available ? weapon : undefined,
    switching: switchingRef.current,
    switchWeapon,
  };
}
