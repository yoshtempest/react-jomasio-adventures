import type { CharacterId } from "@/data/characters/list";
import { CHARACTER_PASSIVES } from "./constants";
import type { CharacterPassiveKind } from "./types";
import type { CharacterPassiveOfKind } from "./types";

export function getCharacterPassive<K extends CharacterPassiveKind["kind"]>(
  characterId: CharacterId,
  kind: K,
): CharacterPassiveOfKind<K> | undefined {
  return CHARACTER_PASSIVES[characterId].find(
    (passive) => passive.effect.kind === kind,
  ) as CharacterPassiveOfKind<K> | undefined;
}
