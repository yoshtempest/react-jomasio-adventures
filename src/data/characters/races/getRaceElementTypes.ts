import { RACE_ELEMENT_HERITAGE, type Race } from "@/utils/types/character/race";
import type { ElementType } from "@/utils/types/battle/element";

/** Tipagens herdadas a partir de um conjunto de raças (mestiçagem). */
export function getRaceElementTypes(races: readonly Race[]): ElementType[] {
  const result: ElementType[] = [];
  for (const race of races) {
    for (const type of RACE_ELEMENT_HERITAGE[race]) {
      if (!result.includes(type)) result.push(type);
    }
  }
  return result;
}
