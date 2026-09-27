import type {
  CharacterStats,
  CharactersProgress,
} from "@/data/characters/defaultProgress";
import { defaultProgress } from "@/data/characters/defaultProgress";
import { CHARACTERS } from "@/data/characters/list";
import { LEVEL_UP_STATS } from "@/data/player/statList";

export function getXPToNextLevel(level: number) {
  if (level <= 10) return level * 10;
  return level * 10 + 90;
}

/**
 * Aplica o ganho de level up: +1 ponto disponível e +1 em todos os stats
 * automáticos (exceto sorte) por nível ganho.
 */
export function applyLevelUpStats(
  stats: CharacterStats,
  levelsGained: number,
): CharacterStats {
  if (levelsGained <= 0) return stats;

  const next: CharacterStats = {
    ...stats,
    points: stats.points + levelsGained,
  };

  for (const stat of LEVEL_UP_STATS) {
    next[stat] = (stats[stat] ?? 0) + levelsGained;
  }

  return next;
}

export function normalizeProgress(data: unknown): CharactersProgress {
  const safe = { ...defaultProgress };
  const raw = data as Partial<CharactersProgress> | undefined;

  for (const char of CHARACTERS) {
    const savedChar = raw?.[char];

    const normalizeNum = (v: unknown, fallback: number): number =>
      typeof v === "number" && !Number.isNaN(v) ? v : fallback;

    safe[char] = {
      level: normalizeNum(savedChar?.level, 1),
      xp: normalizeNum(savedChar?.xp, 0),
      kills: normalizeNum(savedChar?.kills, 0),
      hunger: normalizeNum(savedChar?.hunger, 100),
      sleep: normalizeNum(savedChar?.sleep, 100),
      coins: normalizeNum(savedChar?.coins, 0),
      hyperCoins: normalizeNum(savedChar?.hyperCoins, 0),
      stats: {
        hp: savedChar?.stats?.hp ?? 1,
        strength: savedChar?.stats?.strength ?? 1,
        intelligence: savedChar?.stats?.intelligence ?? 1,
        resistance: savedChar?.stats?.resistance ?? 1,
        tenacity: savedChar?.stats?.tenacity ?? 1,
        luck: savedChar?.stats?.luck ?? 1,
        points: savedChar?.stats?.points ?? 0,
      },
      battleHP:
        typeof savedChar?.battleHP === "number" ? savedChar.battleHP : null,
      battleMana:
        typeof savedChar?.battleMana === "number" ? savedChar.battleMana : null,
    };
  }
  return safe;
}
