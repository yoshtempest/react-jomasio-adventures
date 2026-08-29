import type { WoodLevel } from "@/data/professions/woodLevels";
import {
  GATHER_RARE_XP_MULTIPLIER,
  getGatherXpMultiplier,
} from "./proficiency";

export type WoodGatherResult = {
  items: { itemId: ItemId; qty: number }[];
  /** XP ganho após aplicar o multiplicador por diferença de nível (+10x se dropou raro). */
  xpGained: number;
  /** Multiplicador aplicado (1 = mesmo nível, 0.1 = piso). */
  xpMultiplier: number;
  /** Se a forma rara dropou nesta interação. */
  hasRareDrop: boolean;
};

/**
 * Rola o loot de uma árvore de `wood` para um Lenhador de `playerLevel`.
 *
 * - a madeira comum do nível sempre dropa;
 * - a forma rara (item dropável da profissão daquele tier) dropa com a
 *   chance definida no nível da madeira;
 * - o XP é escalado pela diferença de nível (ver getGatherXpMultiplier);
 * - se a forma rara dropar, o XP é 10x o XP da interação normal
 *   (ver GATHER_RARE_XP_MULTIPLIER).
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

  let hasRareDrop = false;
  if (Math.random() < wood.rareChance) {
    items.push({ itemId: wood.rareId, qty: 1 });
    hasRareDrop = true;
  }

  const xpMultiplier = getGatherXpMultiplier(playerLevel, wood.treeLevel);
  const rareMultiplier = hasRareDrop ? GATHER_RARE_XP_MULTIPLIER : 1;
  const xpGained = Math.round(wood.xp * xpMultiplier * rareMultiplier);

  return { items, xpGained, xpMultiplier, hasRareDrop };
}
