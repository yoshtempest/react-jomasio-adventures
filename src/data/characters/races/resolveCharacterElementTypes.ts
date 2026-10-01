import type { CharacterRace } from "@/utils/types/character/race";
import type { ElementType } from "@/utils/types/battle/element";
import { getRaceElementTypes } from "@/data/characters/races/getRaceElementTypes";

/**
 * Resolve as tipagens efetivas de uma criatura:
 *
 *     herança (raças) ∪ tipagens adicionais
 *
 * Nunca limita mestiços a duas tipagens — a união é aberta e pode combinar
 * quantas raças e extras o personagem tiver (ex.: Humano + Draconiano +
 * Igniano = Normalis + Draco + Pyrus).
 */
export function resolveCharacterElementTypes(
  race: CharacterRace,
): ElementType[] {
  const result = getRaceElementTypes(race.races);
  for (const type of race.extraTypes ?? []) {
    if (!result.includes(type)) result.push(type);
  }
  return result;
}