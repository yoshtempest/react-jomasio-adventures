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

    const normalizeNum = (v: unknown, fallback: number): number =>
      typeof v === "number" && !Number.isNaN(v) ? v : fallback;

    safe[key as Character] = {
      level: normalizeNum(savedChar?.level, 1),
      xp: normalizeNum(savedChar?.xp, 0),
      kills: normalizeNum(savedChar?.kills, 0),
      hunger: normalizeNum(savedChar?.hunger, 100),
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
