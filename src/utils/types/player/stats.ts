export const STATS = ["hp", "strength", "intelligence", "resistance", "tenacity"] as const;

export type StatType = (typeof STATS)[number];
