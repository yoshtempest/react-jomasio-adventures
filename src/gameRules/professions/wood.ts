import type { WoodLevel } from "@/data/professions/woodLevels";
import { getGatherXpMultiplier } from "./proficiency";

export type WoodGatherResult = {
  items: { itemId: ItemId; qty: number }[];
  /** XP ganho após aplicar o multiplicador por diferença de nível. */
  xpGained: number;
  /** Multiplicador aplicado (1 = mesmo nível, 0.1 = piso). */
  xpMultiplier: number;
};

/**
 * Rola o loot de uma árvore de `wood` para um Lenhador de `playerLevel`.
 *
 * - a madeira comum do nível sempre dropa;
 * - a forma rara (item dropável da profissão daquele tier) dropa com a
 *   chance definida no nível da madeira;
 * - o XP é escalado pela diferença de nível (ver getGatherXpMultiplier).
 *
 * O chamador deve garantir playerLevel >= wood.treeLevel antes de chamar.
 */
export function rollWoodGather(
  wood: WoodLevel,
  playerLevel: number,
): WoodGatherResult {
  const items: { itemId: ItemId; qty: number }[] = [
    { itemId: wood.commonId, qty: 1 },
  ];

  if (Math.random() < wood.rareChance) {
    items.push({ itemId: wood.rareId, qty: 1 });
  }

  const xpMultiplier = getGatherXpMultiplier(playerLevel, wood.treeLevel);
  const xpGained = Math.round(wood.xp * xpMultiplier);

  return { items, xpGained, xpMultiplier };
}
