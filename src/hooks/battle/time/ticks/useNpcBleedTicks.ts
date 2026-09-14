import { useEffect } from "react";
import { DOT_TICK_INTERVAL_MS } from "@/gameRules/battle/status/statusEffects";

export function useNpcBleedTicks(params: {
  isEnding: React.RefObject<boolean>;
  isMenuRef?: React.RefObject<boolean>;
  isPausedRef?: React.RefObject<boolean>;
  setNpcHP: React.Dispatch<React.SetStateAction<number>>;
  spawnDamageRef: React.RefObject<
    (value: number, x: number, y: number, type: DamageType) => void
  >;
  npcBleedXRef: React.RefObject<number>;
  npcBleedYRef: React.RefObject<number>;
  npcBleedUntilRef: React.RefObject<number>;
}) {
  const {
    isEnding,
    isMenuRef,
    isPausedRef,
    setNpcHP,
    spawnDamageRef,
    npcBleedXRef,
    npcBleedYRef,
    npcBleedUntilRef,
  } = params;

  useEffect(() => {
    const interval = setInterval(() => {
      if (isEnding.current || isMenuRef?.current || isPausedRef?.current) return;
      if (npcBleedUntilRef.current > Date.now()) {
        setNpcHP((hp) => Math.max(0, hp - 2));
        spawnDamageRef.current?.(
          2,
          npcBleedXRef.current,
          npcBleedYRef.current,
          "bleed",
        );
      }
    }, DOT_TICK_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [
    setNpcHP,
    isEnding,
    isMenuRef,
    isPausedRef,
    npcBleedXRef,
    npcBleedYRef,
    npcBleedUntilRef,
    spawnDamageRef,
  ]);
}