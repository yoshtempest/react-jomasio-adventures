import { useState, useCallback, useRef, useEffect } from "react";

const COMBO_RESET_MS = 4000;

const RANK_THRESHOLDS = [
  { rank: "SS", pct: 75 },
  { rank: "S+", pct: 55 },
  { rank: "S", pct: 40 },
  { rank: "A", pct: 28 },
  { rank: "B", pct: 18 },
  { rank: "C", pct: 10 },
  { rank: "D", pct: 5 },
  { rank: "E", pct: 2 },
] as const;

export type ComboRank = "F" | "E" | "D" | "C" | "B" | "A" | "S" | "S+" | "SS";

function calcRank(damagePct: number): ComboRank {
  for (const { rank, pct } of RANK_THRESHOLDS) {
    if (damagePct >= pct) return rank;
  }
  return "F";
}

function calcProgress(damagePct: number): {
  next: ComboRank | null;
  progress: number;
} {
  let currentRank: ComboRank = "F";
  let next: ComboRank | null = null;

  for (let i = RANK_THRESHOLDS.length - 1; i >= 0; i--) {
    const entry = RANK_THRESHOLDS[i];
    if (damagePct >= entry.pct) {
      currentRank = entry.rank;
      next = i > 0 ? RANK_THRESHOLDS[i - 1].rank : null;
      break;
    }
  }

  if (currentRank === "F") {
    next = RANK_THRESHOLDS[RANK_THRESHOLDS.length - 1]?.rank ?? null;
  }

  const currentThreshold =
    currentRank === "F"
      ? 0
      : RANK_THRESHOLDS.find((t) => t.rank === currentRank)!.pct;
  const nextThreshold = next
    ? RANK_THRESHOLDS.find((t) => t.rank === next)!.pct
    : currentThreshold;

  const progress = next
    ? Math.min(
        1,
        (damagePct - currentThreshold) / (nextThreshold - currentThreshold),
      )
    : 1;

  return { next, progress };
}

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
