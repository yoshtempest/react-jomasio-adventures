import { MIXED_RACE_NAMES } from "@/data/characters/races/mixedNames";
import { combinations } from "@/data/characters/races/combinations";
import { pairKey } from "@/data/characters/races/pairKey";
import type { MixedPair } from "@/data/characters/races/combinations";
import type { Race } from "@/utils/types/character/race";



/**
 * Busca um nome de mestiço para um conjunto de raças, se existir nome
 * registrado para a combinação.
 */
export function getMixedRaceName(races: readonly Race[]): string | null {
  for (const pair of combinations(races) satisfies MixedPair[]) {
    const name = MIXED_RACE_NAMES[pairKey(pair.a, pair.b)];
    if (name) return name;
  }
  return null;
}