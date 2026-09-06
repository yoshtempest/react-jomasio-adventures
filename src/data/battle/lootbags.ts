import { COIN_REWARDS } from "./drops";

/** Janela de coleta de lootbags após derrotar o inimigo principal. */
export const BATTLE_LOOT_WINDOW_MS = 3000;

/** Quantidade de lootbags dropadas por classe do inimigo. */
export const LOOTBAG_COUNT: Record<NPCClass, readonly [number, number]> = {
  common: [2, 3],
  rare: [3, 4],
  epic: [4, 5],
  boss: [5, 6],
  legendary: [6, 8],
};

/** Chance de hypercoins aparecerem no loot de cada classe. */
export const HYPERCOIN_DROP_CHANCE: Record<NPCClass, number> = {
  common: 0.05,
  rare: 0.1,
  epic: 0.2,
  boss: 0.3,
  legendary: 0.5,
};

/** Faixa de hypercoins dropadas por classe (antes do bônus de nível). */
export const HYPERCOIN_AMOUNT: Record<NPCClass, readonly [number, number]> = {
  common: [1, 3],
  rare: [3, 6],
  epic: [6, 12],
  boss: [10, 24],
  legendary: [18, 40],
};

/** Fração da recompensa de kwanzas alocada por lootbag (distribuição proporcional). */
export const LOTBAG_COIN_SHARE = 0.2;

export const LOOTBAG_SPRITES: Record<NPCClass, string> = {
  common: "/assets/items/lootBag/common.svg",
  rare: "/assets/items/lootBag/rare.svg",
  epic: "/assets/items/lootBag/epic.svg",
  boss: "/assets/items/lootBag/boss.svg",
  legendary: "/assets/items/lootBag/legendary.svg",
};

export function rollLootBagCount(npcClass: NPCClass): number {
  const [min, max] = LOOTBAG_COUNT[npcClass];
  return min + Math.floor(Math.random() * (max - min + 1));
}

export function rollHyperCoinAmount(npcClass: NPCClass): number {
  const [min, max] = HYPERCOIN_AMOUNT[npcClass];
  const base = min + Math.floor(Math.random() * (max - min + 1));
  return Math.max(1, Math.round(base / 2));
}

export function getCoinReward(npcClass: NPCClass, npcLevel: number): number {
  return (COIN_REWARDS[npcClass] ?? 0) * npcLevel;
}