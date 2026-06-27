const BEST_TIME_PREFIX = "bestTime_";

export function loadBestTime(npcType: string): number {
  const saved = localStorage.getItem(`${BEST_TIME_PREFIX}${npcType}`);
  return saved ? parseInt(saved, 10) : 0;
}

export function saveBestTime(npcType: string, elapsed: number) {
  const prev = loadBestTime(npcType);
  if (prev === 0 || elapsed < prev) {
    localStorage.setItem(`${BEST_TIME_PREFIX}${npcType}`, elapsed.toString());
  }
}
