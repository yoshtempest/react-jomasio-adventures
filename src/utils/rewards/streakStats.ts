import { STREAK_KEY } from "@/data/storageKeys";
import { createSlotJsonStorage } from "@/utils/rewards/createSlotJsonStorage";

type StreakStats = {
  currentStreak: number;
  bestStreak: number;
  bestStreakPerCharacter: Record<string, number>;
};

const streakStorage = createSlotJsonStorage(STREAK_KEY, (): StreakStats => ({
  currentStreak: 0,
  bestStreak: 0,
  bestStreakPerCharacter: {},
}));

export function recordWin(character: string): void {
  const data = streakStorage.load();
  data.currentStreak += 1;
  if (data.currentStreak > data.bestStreak) {
    data.bestStreak = data.currentStreak;
  }
  const charBest = data.bestStreakPerCharacter[character] ?? 0;
  if (data.currentStreak > charBest) {
    data.bestStreakPerCharacter[character] = data.currentStreak;
  }
  streakStorage.save(data);
}

export function recordDefeat(): void {
  const data = streakStorage.load();
  data.currentStreak = 0;
  streakStorage.save(data);
}

export function getStreakStats(): StreakStats {
  return streakStorage.load();
}
