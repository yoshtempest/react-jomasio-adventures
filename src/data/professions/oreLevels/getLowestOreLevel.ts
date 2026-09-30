import { ORE_LEVELS } from "./constants";

/** Nível mínimo de minério disponível (0) e o mais baixo com drop. */
export function getLowestOreLevel(): number {
  return ORE_LEVELS[0]?.rockLevel ?? 0;
}
