export const COMBO_RESET_MS = 4000;

export const RANK_THRESHOLDS = [
  { rank: "SS", pct: 95 },
  { rank: "S+", pct: 75 },
  { rank: "S", pct: 60 },
  { rank: "A", pct: 40 },
  { rank: "B", pct: 25 },
  { rank: "C", pct: 15 },
  { rank: "D", pct: 10 },
  { rank: "E", pct: 4 },
  { rank: "F", pct: 0 },
] as const;