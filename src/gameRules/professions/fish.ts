import type { FishLevel } from "@/data/professions/fishLevels";
import {
  GATHER_RARE_XP_MULTIPLIER,
  getGatherXpMultiplier,
} from "./proficiency";

export type FishGatherResult = {
  items: { itemId: ItemId; qty: number }[];
  /** XP ganho após aplicar o multiplicador por diferença de nível (+10x se dropou raro). */
  xpGained: number;
  /** Multiplicador aplicado (1 = mesmo nível, 0.1 = piso). */
  xpMultiplier: number;
  /** Se a forma rara de algum peixe dropou nesta interação. */
  hasRareDrop: boolean;
};

/**
 * Rola o loot de uma pescaria de `fishLevel` para um Pescador de
 * `playerLevel`.
 *
 * - o(s) peixe(s) comum(ns) do nível sempre dropam;
 * - a forma rara de cada peixe dropa com a chance definida no nível;
 * - o XP é escalado pela diferença de nível (ver getGatherXpMultiplier);
 * - se a forma rara dropar, o XP é 10x o XP da interação normal
 *   (ver GATHER_RARE_XP_MULTIPLIER).
 *
 * Recebe as entradas do nível já filtradas, porque um nível pode ter mais de
 * um peixe (o nv.120 tem dois). Devolve null quando a lista vem vazia. O
 * chamador deve garantir playerLevel >= fishLevel antes de chamar.
 */
export function rollFishGather(
  fishes: FishLevel[],
  playerLevel: number,
): FishGatherResult | null {
  if (fishes.length === 0) return null;

  const items: { itemId: ItemId; qty: number }[] = [];
  let hasRareDrop = false;

  for (const fish of fishes) {
    items.push({ itemId: fish.commonId, qty: 1 });
    if (Math.random() < fish.rareChance) {
      items.push({ itemId: fish.rareId, qty: 1 });
      hasRareDrop = true;
    }
  }

  const xpMultiplier = getGatherXpMultiplier(
    playerLevel,
    fishes[0]?.fishLevel ?? 0,
  );
  const rareMultiplier = hasRareDrop ? GATHER_RARE_XP_MULTIPLIER : 1;
  const xpGained = Math.round(
    (fishes[0]?.xp ?? 0) * xpMultiplier * rareMultiplier,
  );

  return { items, xpGained, xpMultiplier, hasRareDrop };
}
