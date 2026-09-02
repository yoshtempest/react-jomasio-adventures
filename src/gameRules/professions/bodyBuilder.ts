import type { WeightLevel } from "@/data/professions/weightLevels";
import {
  GATHER_RARE_XP_MULTIPLIER,
  getGatherXpMultiplier,
} from "./proficiency";

export type WeightTrainResult = {
  items: { itemId: ItemId; qty: number }[];
  /** XP ganho após aplicar o multiplicador por diferença de nível (+10x se dropou raro). */
  xpGained: number;
  /** Multiplicador aplicado (1 = mesmo nível, 0.1 = piso). */
  xpMultiplier: number;
  /** Se a forma rara do peso dropou nesta interação. */
  hasRareDrop: boolean;
};

/**
 * Rola o resultado de um treino com `weight` para um Bodybuilder de
 * `playerLevel`.
 *
 * - o peso comum do nível sempre entra no inventário;
 * - a forma rara dropa com a chance definida no nível do peso;
 * - o XP é escalado pela diferença de nível (ver getGatherXpMultiplier);
 * - se a forma rara dropar, o XP é 10x o XP da interação normal
 *   (ver GATHER_RARE_XP_MULTIPLIER).
 *
 * O chamador deve garantir playerLevel >= weight.weightLevel antes de
 * chamar.
 */
export function rollWeightTrain(
  weight: WeightLevel,
  playerLevel: number,
): WeightTrainResult {
  const items: { itemId: ItemId; qty: number }[] = [
    { itemId: weight.commonId, qty: 1 },
  ];

  let hasRareDrop = false;
  if (Math.random() < weight.rareChance) {
    items.push({ itemId: weight.rareId, qty: 1 });
    hasRareDrop = true;
  }

  const xpMultiplier = getGatherXpMultiplier(playerLevel, weight.weightLevel);
  const rareMultiplier = hasRareDrop ? GATHER_RARE_XP_MULTIPLIER : 1;
  const xpGained = Math.round(weight.xp * xpMultiplier * rareMultiplier);

  return { items, xpGained, xpMultiplier, hasRareDrop };
}
