import type { CharacterId } from "@/data/characters/list";
import { CHARACTER_PASSIVES } from "./constants";
import type { CharacterPassive } from "./types";

export function getCharacterPassives(
  characterId: CharacterId,
): CharacterPassive[] {
  return CHARACTER_PASSIVES[characterId];
}
