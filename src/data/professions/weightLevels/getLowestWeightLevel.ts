import { WEIGHT_LEVELS } from "./constants";

/** Nível mínimo de peso disponível (o mais baixo treinável). */
export function getLowestWeightLevel(): number {
  return WEIGHT_LEVELS[0]?.weightLevel ?? 0;
}
