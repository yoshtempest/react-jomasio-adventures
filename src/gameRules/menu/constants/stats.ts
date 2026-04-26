export const STATS = ["hp", "strength", "intelligence"] as const;

export type StatType = typeof STATS[number];