import { useEffect } from "react";
import {
  POISON_TICK_DAMAGE,
  DOT_TICK_INTERVAL_MS,
} from "@/gameRules/battle/status/statusEffects";

export function useStatusDotTicks(params: {
  isEnding: React.RefObject<boolean>;
  isMenuRef?: React.RefObject<boolean>;
  isPausedRef?: React.RefObject<boolean>;
  setPlayerHP: React.Dispatch<React.SetStateAction<number>>;
  spawnDamageRef: React.RefObject<
    (value: number, x: number, y: number, type: DamageType) => void
  >;
  burnTickDamage: number;
  bleedXRef: React.RefObject<number>;
  bleedYRef: React.RefObject<number>;
  bleedUntilRef: React.RefObject<number>;
  burnUntilRef: React.RefObject<number>;
  poisonUntilRef: React.RefObject<number>;
}) {
  const {
    isEnding,
    isMenuRef,
    isPausedRef,
    setPlayerHP,
    spawnDamageRef,
    burnTickDamage,
    bleedXRef,
    bleedYRef,
    bleedUntilRef,
    burnUntilRef,
    poisonUntilRef,
  } = params;

  useEffect(() => {
    const interval = setInterval(() => {
      if (isEnding.current || isMenuRef?.current || isPausedRef?.current) return;
      if (bleedUntilRef.current > Date.now()) {
        setPlayerHP((hp) => Math.max(0, hp - 2));
        spawnDamageRef.current?.(
          2,
          bleedXRef.current,
          bleedYRef.current,
          "bleed",
        );
      }
      if (burnUntilRef.current > Date.now()) {
        setPlayerHP((hp) => Math.max(0, hp - burnTickDamage));
        spawnDamageRef.current?.(
          burnTickDamage,
          bleedXRef.current,
          bleedYRef.current,
          "burn",
        );
      }
      if (poisonUntilRef.current > Date.now()) {
        setPlayerHP((hp) => Math.max(0, hp - POISON_TICK_DAMAGE));
        spawnDamageRef.current?.(
          POISON_TICK_DAMAGE,
          bleedXRef.current,
          bleedYRef.current,
          "poison",
        );
      }
    }, DOT_TICK_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [
    setPlayerHP,
    isEnding,
    isMenuRef,
    isPausedRef,
    burnTickDamage,
    bleedXRef,
    bleedYRef,
    bleedUntilRef,
    burnUntilRef,
    poisonUntilRef,
    spawnDamageRef,
  ]);
}