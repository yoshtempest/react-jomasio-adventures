import type { CharacterEquipmentData } from "@/data/equipment/storage";
import { addToCollection } from "./addToCollection";
import { getMutableState } from "./getMutableState";

export function unequipAccessoryAt(
  allData: Record<string, CharacterEquipmentData>,
  character: CharacterId,
  index: number,
): Record<string, CharacterEquipmentData> | null {
  const { next, data, collection } = getMutableState(allData, character);

  const extras = data.equipped.accessories;
  if (index < 0 || index >= extras.length) return null;

  const info = extras[index]!;
  addToCollection(collection, info.id, info.enhance);

  next[character] = {
    equipped: {
      ...data.equipped,
      accessories: extras.filter((_, i) => i !== index),
    },
    collection,
  };
  return next;
}
