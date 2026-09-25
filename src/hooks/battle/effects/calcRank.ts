import { RANK_THRESHOLDS } from "@/data/battle/combo";
import type { ComboRank } from "@/utils/types/battle/combo";

export function calcRank(damagePct: number): ComboRank {
  for (const { rank, pct } of RANK_THRESHOLDS) {
    if (damagePct >= pct) return rank;
  }
  return "F";
}