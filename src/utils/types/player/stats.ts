export const STATS = [
  "hp",
  "strength",
  "intelligence",
  "resistance",
  "tenacity",
  "luck",
] as const;

export type StatType = (typeof STATS)[number];
