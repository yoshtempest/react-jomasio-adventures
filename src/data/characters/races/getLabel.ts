import { RACE_LABELS } from "@/data/characters/races/labels";
import type { CharacterRace } from "@/utils/types/character/race";

/**
 * Nome de exibição da raça de uma criatura.
 *
 * Mestiços listam todas as linhagens herdadas (ex.: "Humano / Obscuriano").
 */
export function getRaceLabel(race: CharacterRace): string {
  return race.races.map((r) => RACE_LABELS[r]).join(" / ");
}