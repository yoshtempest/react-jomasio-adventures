import { ELEMENT_STRONG_AGAINST } from "@/data/types/elementChart";
import { combatService } from "@/services/combat";
import type { ElementType } from "@/utils/types/battle/element";

export const ELEMENT_TYPES = Object.keys(
  ELEMENT_STRONG_AGAINST,
) as ElementType[];

export type ElementRelations = {
  attacker: ElementType;
  superEffective: ElementType[];
  normal: ElementType[];
  notEffective: ElementType[];
};

/**
 * Classifica todo defensor pelo multiplicador que o atacante recebe contra
 * ele, usando o mesmo `combatService.getElementMultiplier` do combate — a
 * planilha não pode divergir do dano real, então nenhuma regra é reescrita
 * aqui.
 */
export function getElementRelations(attacker: ElementType): ElementRelations {
  const superEffective: ElementType[] = [];
  const normal: ElementType[] = [];
  const notEffective: ElementType[] = [];

  for (const defender of ELEMENT_TYPES) {
    const multiplier = combatService.getElementMultiplier(
      [attacker],
      [defender],
    );

    if (multiplier > 1) {
      superEffective.push(defender);
    } else if (multiplier < 1) {
      notEffective.push(defender);
    } else {
      normal.push(defender);
    }
  }

  return { attacker, superEffective, normal, notEffective };
}

export function getElementChart(): ElementRelations[] {
  return ELEMENT_TYPES.map(getElementRelations);
}
