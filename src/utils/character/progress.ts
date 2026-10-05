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

  /**
   * Stats do schema anterior ao split Técnica/Espírito. `hp` virou derivado da
   * Resistência e `intelligence` foi partida em `technique` + `spirit`.
   */
  type LegacyStats = {
    hp?: unknown;
    intelligence?: unknown;
  };

  for (const char of CHARACTERS) {
    const savedChar = raw?.[char];
    const legacy = (savedChar?.stats ?? {}) as LegacyStats;

    const normalizeNum = (v: unknown, fallback: number): number =>
      typeof v === "number" && !Number.isNaN(v) ? v : fallback;

    // Folding sem perder investimento: o HP antigo entra na Resistência (que
    // agora alimenta a vida) e a Inteligência antiga vira o valor cheio em
    // Técnica E em Espírito. Não é metade pra cada de propósito — a
    // Inteligência alimentava os dois tipos de special ao mesmo tempo, então
    // cortar pela metade nerfaria toda build existente. Devolver o valor
    // completo torna a separação uma decisão livre a partir de agora: quem
    // quiserphysique ou mágico com o mesmo investimento antigo escolhe.
    const legacyHp = normalizeNum(legacy.hp, 1);
    const legacyInt = normalizeNum(legacy.intelligence, 1);

    safe[char] = {
      level: normalizeNum(savedChar?.level, 1),
      xp: normalizeNum(savedChar?.xp, 0),
      kills: normalizeNum(savedChar?.kills, 0),
      hunger: normalizeNum(savedChar?.hunger, 100),
      sleep: normalizeNum(savedChar?.sleep, 100),
      coins: normalizeNum(savedChar?.coins, 0),
      hyperCoins: normalizeNum(savedChar?.hyperCoins, 0),
      stats: {
        strength: normalizeNum(savedChar?.stats?.strength, 1),
        technique: normalizeNum(savedChar?.stats?.technique, legacyInt),
        spirit: normalizeNum(savedChar?.stats?.spirit, legacyInt),
        resistance:
          normalizeNum(savedChar?.stats?.resistance, 1) + (legacyHp - 1),
        tenacity: normalizeNum(savedChar?.stats?.tenacity, 1),
        luck: normalizeNum(savedChar?.stats?.luck, 1),
        points: normalizeNum(savedChar?.stats?.points, 0),
      },
      battleHP:
        typeof savedChar?.battleHP === "number" ? savedChar.battleHP : null,
      battleMana:
        typeof savedChar?.battleMana === "number" ? savedChar.battleMana : null,
    };
  }
  return safe;
}
