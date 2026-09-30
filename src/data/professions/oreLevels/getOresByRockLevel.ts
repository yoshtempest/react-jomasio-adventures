import { ORE_LEVELS } from "./constants";
import type { OreLevel } from "./types";

/** Retorna todos os minérios (entradas) de um dado nível de rocha. */
export function getOresByRockLevel(rockLevel: number): OreLevel[] {
  return ORE_LEVELS.filter((o) => o.rockLevel === rockLevel);
}
