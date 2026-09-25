import { RANK_THRESHOLDS } from "@/data/battle/combo";
import type { ComboRank } from "@/utils/types/battle/combo";

export function calcProgress(damagePct: number): {
  next: ComboRank | null;
  progress: number;
} {
  let currentRank: ComboRank = "F";
  let next: ComboRank | null = null;

  for (let i = 0; i < RANK_THRESHOLDS.length; i++) {
    const entry = RANK_THRESHOLDS[i]!;
    if (damagePct >= entry.pct) {
      currentRank = entry.rank;
      next = i > 0 ? (RANK_THRESHOLDS[i - 1]?.rank ?? null) : null;
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