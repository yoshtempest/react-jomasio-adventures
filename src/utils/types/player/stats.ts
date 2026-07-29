export const STATS = [
  "hp",
  "strength",
  "intelligence",
  "resistance",
  "luck",
] as const;

export type StatType = (typeof STATS)[number];
