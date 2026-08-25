export const HUNGER_TICK_MS = 30_000; // check every 30s
export const HUNGER_INTERVAL_MS = 60_000; // 1 min

export const DIFFICULTY_HUNGER_RATE: Record<NpcDifficulty, number> = {
  easy: 0,
  medium: -1,
  hard: -2,
  insano: -3,
};
