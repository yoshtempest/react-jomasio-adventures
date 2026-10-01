import { CHARACTER_RACES } from "@/data/characters/races/character";
import { resolveCharacterElementTypes } from "@/data/characters/races/resolveCharacterElementTypes";
import type { ElementType } from "@/utils/types/battle/element";

/**
 * Tipagens efetivas do personagem (herdadas das raças + adicionais).
 * Compatível com `CHARACTER_ELEMENT_TYPES` — resolvem a mesma tipagem.
 */
export function getCharacterElementTypes(
  character: CharacterId,
): ElementType[] {
  return resolveCharacterElementTypes(CHARACTER_RACES[character]);
}
