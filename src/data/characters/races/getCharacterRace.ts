import type { CharacterRace } from "@/utils/types/character/race";
import { CHARACTER_RACES } from "./character";

export function getCharacterRace(character: CharacterId): CharacterRace {
  return CHARACTER_RACES[character];
}