import { WEIGHT_LEVELS } from "./constants";
import type { WeightLevel } from "./types";

/** Retorna o peso de um dado nível, ou null quando não existe peso no nível. */
export function getWeightLevelByTrainLevel(
  weightLevel: number,
): WeightLevel | null {
  return WEIGHT_LEVELS.find((w) => w.weightLevel === weightLevel) ?? null;
}
