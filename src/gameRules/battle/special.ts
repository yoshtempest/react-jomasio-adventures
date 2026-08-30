import { SPECIAL_HITS_BY_CLASS } from "@/gameRules/battle/classes";
import type { CharacterId } from "@/data/characters/list";

/**
 * Personagens com multiplicador de carga do especial. O artur carrega rápido
 * demais (cada extra punch conta como hit), então precisa de 1.5x da carga
 * normal.
 */
export const SPECIAL_CHARGE_MULTIPLIER: Partial<Record<CharacterId, number>> = {
  artur: 1.5,
};

export function getMaxSpecial(
  playerClass: PlayerClass | null,
  character?: CharacterId,
) {
  const base =
    playerClass === "fracote"
      ? SPECIAL_HITS_BY_CLASS.fracote
      : SPECIAL_HITS_BY_CLASS.default;
  const multiplier = character
    ? (SPECIAL_CHARGE_MULTIPLIER[character] ?? 1)
    : 1;

  return Math.ceil(base * multiplier);
}

export function gainSpecial(current: number, max: number) {
  return Math.min(current + 1, max);
}
