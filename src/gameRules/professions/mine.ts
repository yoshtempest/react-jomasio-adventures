import { getOresByRockLevel } from "@/data/professions/oreLevels";
import { getGatherXpMultiplier } from "./proficiency";

export type MineGatherResult = {
  items: { itemId: ItemId; qty: number }[];
  /** XP ganho após aplicar o multiplicador por diferença de nível. */
  xpGained: number;
  /** Multiplicador aplicado (1 = mesmo nível, 0.1 = piso). */
  xpMultiplier: number;
};

/**
 * Rola o loot de uma rocha de `rockLevel` para um Mineiro de `playerLevel`.
 *
 * - o(s) minério(s) comum(ns) do nível sempre dropam;
 * - a forma rara (item dropável da profissão daquele tier) de cada minério
 *   dropa com a chance definida no nível;
 * - o XP é escalado pela diferença de nível (ver getGatherXpMultiplier).
 *
 * Retorna null se não houver minério para o nível informado. O chamador deve
 * garantir playerLevel >= rockLevel antes de chamar.
 */
export function rollMineGather(
  rockLevel: number,
  playerLevel: number,
): MineGatherResult | null {
  const ores = getOresByRockLevel(rockLevel);
  if (ores.length === 0) return null;

  const items: { itemId: ItemId; qty: number }[] = [];
  for (const ore of ores) {
    items.push({ itemId: ore.commonId, qty: 1 });
    if (Math.random() < ore.rareChance) {
      items.push({ itemId: ore.rareId, qty: 1 });
    }
  }

  const xpMultiplier = getGatherXpMultiplier(playerLevel, rockLevel);
  const xpGained = Math.round((ores[0]?.xp ?? 0) * xpMultiplier);

  return { items, xpGained, xpMultiplier };
}
