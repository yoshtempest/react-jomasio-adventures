import type { Character } from "@/utils/types/player/player";
import { CHARACTERS } from "@/utils/types/player/player";

export type CharacterStats = {
  hp: number;
  strength: number;
  intelligence: number;
  resistance: number;
  tenacity: number;
  luck: number;
  points: number;
};

export type CharacterProgress = {
  level: number;
  xp: number;
  kills: number;
  hunger: number;
  coins: number;
  hyperCoins: number;
  stats: CharacterStats;
  battleHP?: number | null;
};

export type CharactersProgress = Record<Character, CharacterProgress>;

function createDefaultProgress(): CharacterProgress {
  return {
    level: 1,
    xp: 0,
    kills: 0,
    hunger: 100,
    coins: 0,
    hyperCoins: 0,
    stats: {
      hp: 1,
      strength: 1,
      intelligence: 1,
      resistance: 1,
      tenacity: 1,
      luck: 1,
      points: 0,
    },
  };
}

export const defaultProgress: CharactersProgress = Object.fromEntries(
  CHARACTERS.map((c) => [c, createDefaultProgress()]),
) as CharactersProgress;
