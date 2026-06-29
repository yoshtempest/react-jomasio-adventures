import { STREAK_KEY } from "@/data/storageKeys";
import { slotKey } from "@/utils/save/slotManager";

type StreakStats = {
  currentStreak: number;
  bestStreak: number;
  bestStreakPerCharacter: Record<string, number>;
};

function createDefault(): StreakStats {
  return { currentStreak: 0, bestStreak: 0, bestStreakPerCharacter: {} };
}

function load(): StreakStats {
  try {
    const raw = localStorage.getItem(slotKey(STREAK_KEY));
    if (!raw) return createDefault();
    return JSON.parse(raw) as StreakStats;
  } catch {
    return createDefault();
  }
}

function save(data: StreakStats): void {
  try {
    localStorage.setItem(slotKey(STREAK_KEY), JSON.stringify(data));
  } catch {}
}

export function recordWin(character: string): void {
  const data = load();
  data.currentStreak += 1;
  if (data.currentStreak > data.bestStreak) {
    data.bestStreak = data.currentStreak;
  }
  const charBest = data.bestStreakPerCharacter[character] ?? 0;
  if (data.currentStreak > charBest) {
    data.bestStreakPerCharacter[character] = data.currentStreak;
  }
  save(data);
}

export function recordDefeat(): void {
  const data = load();
  data.currentStreak = 0;
  save(data);
}

export function getStreakStats(): StreakStats {
  return load();
}
