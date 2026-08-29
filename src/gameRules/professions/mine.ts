import { getOresByRockLevel } from "@/data/professions/oreLevels";
import {
  GATHER_RARE_XP_MULTIPLIER,
  getGatherXpMultiplier,
} from "./proficiency";

export type MineGatherResult = {
  items: { itemId: ItemId; qty: number }[];
  /** XP ganho após aplicar o multiplicador por diferença de nível (+10x se dropou raro). */
  xpGained: number;
  /** Multiplicador aplicado (1 = mesmo nível, 0.1 = piso). */
  xpMultiplier: number;
  /** Se a forma rara de algum minério dropou nesta interação. */
  hasRareDrop: boolean;
};

/**
 * Rola o loot de uma rocha de `rockLevel` para um Mineiro de `playerLevel`.
 *
 * - o(s) minério(s) comum(ns) do nível sempre dropam;
 * - a forma rara (item dropável da profissão daquele tier) de cada minério
 *   dropa com a chance definida no nível;
 * - o XP é escalado pela diferença de nível (ver getGatherXpMultiplier);
 * - se a forma rara dropar, o XP é 10x o XP da interação normal
 *   (ver GATHER_RARE_XP_MULTIPLIER).
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
  let hasRareDrop = false;
  for (const ore of ores) {
    items.push({ itemId: ore.commonId, qty: 1 });
    if (Math.random() < ore.rareChance) {
      items.push({ itemId: ore.rareId, qty: 1 });
      hasRareDrop = true;
    }
  }

  const xpMultiplier = getGatherXpMultiplier(playerLevel, rockLevel);
  const rareMultiplier = hasRareDrop ? GATHER_RARE_XP_MULTIPLIER : 1;
  const xpGained = Math.round(
    (ores[0]?.xp ?? 0) * xpMultiplier * rareMultiplier,
  );

  return { items, xpGained, xpMultiplier, hasRareDrop };
}
