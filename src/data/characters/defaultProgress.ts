import type { Character } from "@/utils/types/player/player";

export type CharacterStats = {
  hp: number;
  strength: number;
  intelligence: number;
  resistance: number;
  tenacity: number;
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
};

export type CharactersProgress = Record<Character, CharacterProgress>;

export const defaultProgress: CharactersProgress = {
  marcelo: {
    level: 1,
    xp: 0,
    kills: 0,
    hunger: 100,
    coins: 0,
    hyperCoins: 0,
    stats: { hp: 1, strength: 1, intelligence: 1, resistance: 1, tenacity: 1, points: 0 },
  },
  eduarda: {
    level: 1,
    xp: 0,
    kills: 0,
    hunger: 100,
    coins: 0,
    hyperCoins: 0,
    stats: { hp: 1, strength: 1, intelligence: 1, resistance: 1, tenacity: 1, points: 0 },
  },
  lucas: {
    level: 1,
    xp: 0,
    kills: 0,
    hunger: 100,
    coins: 0,
    hyperCoins: 0,
    stats: { hp: 1, strength: 1, intelligence: 1, resistance: 1, tenacity: 1, points: 0 },
  },
  samuel: {
    level: 1,
    xp: 0,
    kills: 0,
    hunger: 100,
    coins: 0,
    hyperCoins: 0,
    stats: { hp: 1, strength: 1, intelligence: 1, resistance: 1, tenacity: 1, points: 0 },
  },
  artur: {
    level: 1,
    xp: 0,
    kills: 0,
    hunger: 100,
    coins: 0,
    hyperCoins: 0,
    stats: { hp: 1, strength: 1, intelligence: 1, resistance: 1, tenacity: 1, points: 0 },
  },
  mayra: {
    level: 1,
    xp: 0,
    kills: 0,
    hunger: 100,
    coins: 0,
    hyperCoins: 0,
    stats: { hp: 1, strength: 1, intelligence: 1, resistance: 1, tenacity: 1, points: 0 },
  },
  lucaua: {
    level: 1,
    xp: 0,
    kills: 0,
    hunger: 100,
    coins: 0,
    hyperCoins: 0,
    stats: { hp: 1, strength: 1, intelligence: 1, resistance: 1, tenacity: 1, points: 0 },
  },
  riquelme: {
    level: 1,
    xp: 0,
    kills: 0,
    hunger: 100,
    coins: 0,
    hyperCoins: 0,
    stats: { hp: 1, strength: 1, intelligence: 1, resistance: 1, tenacity: 1, points: 0 },
  },
  hiago: {
    level: 1,
    xp: 0,
    kills: 0,
    hunger: 100,
    coins: 0,
    hyperCoins: 0,
    stats: { hp: 1, strength: 1, intelligence: 1, resistance: 1, tenacity: 1, points: 0 },
  },
  larissa: {
    level: 1,
    xp: 0,
    kills: 0,
    hunger: 100,
    coins: 0,
    hyperCoins: 0,
    stats: { hp: 1, strength: 1, intelligence: 1, resistance: 1, tenacity: 1, points: 0 },
  },
  camilly: {
    level: 1,
    xp: 0,
    kills: 0,
    hunger: 100,
    coins: 0,
    hyperCoins: 0,
    stats: { hp: 1, strength: 1, intelligence: 1, resistance: 1, tenacity: 1, points: 0 },
  },
  emanuel: {
    level: 1,
    xp: 0,
    kills: 0,
    hunger: 100,
    coins: 0,
    hyperCoins: 0,
    stats: { hp: 1, strength: 1, intelligence: 1, resistance: 1, tenacity: 1, points: 0 },
  },
};
