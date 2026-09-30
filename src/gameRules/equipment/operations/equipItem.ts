import { MAX_ACCESSORIES } from "@/data/equipment/definitions";
import { getEquipmentById } from "@/data/equipment";
import { colKey, type CharacterEquipmentData } from "@/data/equipment/storage";
import { addToCollection } from "./addToCollection";
import { getMutableState } from "./getMutableState";

export function equipItem(
  allData: Record<string, CharacterEquipmentData>,
  character: CharacterId,
  id: EquipmentId,
  enhance: number = 0,
): Record<string, CharacterEquipmentData> | null {
  const item = getEquipmentById(id);
  if (!item) return null;
  const key = colKey(id, enhance);

  const { next, data, collection } = getMutableState(allData, character);

  if (!collection[key] || collection[key] <= 0) return null;

  collection[key] -= 1;
  if (collection[key] <= 0) delete collection[key];

  if (item.slot === "accessory") {
    const extras = data.equipped.accessories;

    if (!data.equipped.accessory) {
      next[character] = {
        equipped: { ...data.equipped, accessory: { id, enhance } },
        collection,
      };
      return next;
    }

    if (extras.length >= MAX_ACCESSORIES) {
      return null;
    }

    next[character] = {
      equipped: { ...data.equipped, accessories: [...extras, { id, enhance }] },
      collection,
    };
    return next;
  }

  const oldInfo = data.equipped[item.slot];
  const equipped = { ...data.equipped, [item.slot]: { id, enhance } };

  if (oldInfo) {
    addToCollection(collection, oldInfo.id, oldInfo.enhance);
  }

  next[character] = { equipped, collection };
  return next;
}
