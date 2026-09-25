import { useState, useCallback, useRef, useEffect } from "react";
import { COMBO_RESET_MS } from "@/data/battle/combo";
import type { ComboRank } from "@/utils/types/battle/combo";
import { calcProgress } from "./calcProgress";
import { calcRank } from "./calcRank";

type Props = {
  npcMaxHp: number;
};

export function useComboSystem({ npcMaxHp }: Props) {
  const [comboCount, setComboCount] = useState(0);
  const [comboRank, setComboRank] = useState<ComboRank>("F");
  const [progress, setProgress] = useState(0);
  const [nextRank, setNextRank] = useState<ComboRank | null>(null);
  const highestDamageRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const updateRank = useCallback(
    (damage: number) => {
      const pct = npcMaxHp > 0 ? (damage / npcMaxHp) * 100 : 0;
      const rankResult = calcRank(pct);
      setComboRank(rankResult);

      const { next, progress: prog } = calcProgress(pct);
      setProgress(prog);
      setNextRank(next);
    },
    [npcMaxHp],
  );

  const registerHit = useCallback(
    (damage: number) => {
      clearTimer();

      highestDamageRef.current += damage;
      updateRank(highestDamageRef.current);

      setComboCount((prev) => prev + 1);

      timerRef.current = setTimeout(() => {
        setComboCount(0);
        setComboRank("F");
        setProgress(0);
        setNextRank(null);
        highestDamageRef.current = 0;
      }, COMBO_RESET_MS);
    },
    [clearTimer, updateRank],
  );

  const resetCombo = useCallback(() => {
    clearTimer();
    setComboCount(0);
    setComboRank("F");
    setProgress(0);
    setNextRank(null);
    highestDamageRef.current = 0;
  }, [clearTimer]);

  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  return { comboCount, comboRank, progress, nextRank, registerHit, resetCombo };
}
