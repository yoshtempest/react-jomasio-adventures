import type { CharactersProgress } from "@/data/characters/defaultProgress";
import { defaultProgress } from "@/data/characters/defaultProgress";
import type { Character } from "@/utils/types/player/player";

export function getXPToNextLevel(level: number) {
  if (level <= 10) return level * 10;
  return level * 10 + 90;
}

export function normalizeProgress(data: unknown): CharactersProgress {
  const safe = { ...defaultProgress };
  const raw = data as Partial<CharactersProgress> | undefined;

  for (const key in safe) {
    const savedChar = raw?.[key as Character];

    safe[key as Character] = {
      level: savedChar?.level ?? 1,
      xp: savedChar?.xp ?? 0,
      kills: savedChar?.kills ?? 0,
      stats: {
        hp: savedChar?.stats?.hp ?? 1,
        strength: savedChar?.stats?.strength ?? 1,
        intelligence: savedChar?.stats?.intelligence ?? 1,
        resistance: savedChar?.stats?.resistance ?? 1,
        points: savedChar?.stats?.points ?? 0,
      },
    };
  }
  return safe;
}
