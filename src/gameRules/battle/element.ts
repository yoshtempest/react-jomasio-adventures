import {
  ELEMENT_STRONG_AGAINST,
  ELEMENT_WEAK_AGAINST,
} from "@/data/types/elementChart";
import type { ElementType } from "@/utils/types/battle/element";

export const SUPER_EFFECTIVE_MULTIPLIER = 1.5;
export const NOT_VERY_EFFECTIVE_MULTIPLIER = 0.5;

export function getElementMultiplier(
  attackerTypes: readonly ElementType[],
  defenderTypes: readonly ElementType[],
): number {
  let multiplier = 1;

  for (const attacker of attackerTypes) {
    for (const defender of defenderTypes) {
      if (ELEMENT_STRONG_AGAINST[attacker].includes(defender)) {
        multiplier *= SUPER_EFFECTIVE_MULTIPLIER;
      } else if (ELEMENT_WEAK_AGAINST[attacker].includes(defender)) {
        multiplier *= NOT_VERY_EFFECTIVE_MULTIPLIER;
      }
    }
  }

  return multiplier;
}
