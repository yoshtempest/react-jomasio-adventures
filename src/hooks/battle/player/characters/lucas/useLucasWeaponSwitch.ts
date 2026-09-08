import { useCallback, useEffect, useRef, useState } from "react";
import {
  DEFAULT_LUCAS_WEAPON,
  rollNextLucasWeapon,
  type LucasWeapon,
} from "@/data/characters/lucasWeapons";

export const LUCAS_WEAPON_SWITCH_DURATION_MS = 600;

type Props = {
  character: CharacterId;
  isEndingRef: React.RefObject<boolean>;
  hitstopRef: React.RefObject<number>;
};

/**
 * Mecânica única do Lucas (Yvel): botão extra que congela a batalha por um
 * instante e troca aleatoriamente para outra arma (nunca a atual, e nunca
 * withBow/arms/withNothing). A troca altera as sprites do personagem.
 */
export function useLucasWeaponSwitch({
  character,
  isEndingRef,
  hitstopRef,
}: Props) {
  const [weapon, setWeapon] = useState<LucasWeapon>(DEFAULT_LUCAS_WEAPON);
  const switchingRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const available = character === "lucas";

  const switchWeapon = useCallback(() => {
    if (!available) return;
    if (isEndingRef.current) return;
    if (switchingRef.current) return;

    switchingRef.current = true;
    hitstopRef.current = Date.now() + LUCAS_WEAPON_SWITCH_DURATION_MS;

    const next = rollNextLucasWeapon(weapon);
    setWeapon(next);

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      switchingRef.current = false;
      timerRef.current = null;
    }, LUCAS_WEAPON_SWITCH_DURATION_MS);
  }, [available, isEndingRef, hitstopRef, weapon]);

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
