import type { CharacterEquipmentData } from "@/data/equipment/storage";
import { addToCollection } from "./addToCollection";
import { getMutableState } from "./getMutableState";

export function addDrop(
  allData: Record<string, CharacterEquipmentData>,
  character: CharacterId,
  id: EquipmentId,
  enhance: number = 0,
): Record<string, CharacterEquipmentData> {
  const { next, data, collection } = getMutableState(allData, character);
  addToCollection(collection, id, enhance);
  next[character] = { ...data, collection };
  return next;
}
