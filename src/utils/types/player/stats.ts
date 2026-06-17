export const STATS = ["hp", "strength", "intelligence", "resistance"] as const;

export type StatType = (typeof STATS)[number];
