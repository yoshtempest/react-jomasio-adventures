import type { CharacterEquipmentData } from "@/data/equipment/storage";
import { addToCollection } from "./addToCollection";
import { getMutableState } from "./getMutableState";

export function unequipItem(
  allData: Record<string, CharacterEquipmentData>,
  character: CharacterId,
  slot: EquipmentSlot,
): Record<string, CharacterEquipmentData> | null {
  const { next, data, collection } = getMutableState(allData, character);

  if (slot === "accessory") {
    const extras = data.equipped.accessories;
    if (extras.length > 0) {
      const lastInfo = extras[extras.length - 1]!;
      addToCollection(collection, lastInfo.id, lastInfo.enhance);

      next[character] = {
        equipped: { ...data.equipped, accessories: extras.slice(0, -1) },
        collection,
      };
      return next;
    }
  }

  const oldInfo = data.equipped[slot];
  if (!oldInfo) return null;

  addToCollection(collection, oldInfo.id, oldInfo.enhance);

  next[character] = {
    equipped: { ...data.equipped, [slot]: null },
    collection,
  };
  return next;
}
