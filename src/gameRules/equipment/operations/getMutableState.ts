import {
  getCharacterData,
  type CharacterEquipmentData,
} from "@/data/equipment/storage";

export function getMutableState(
  allData: Record<string, CharacterEquipmentData>,
  character: CharacterId,
): {
  next: Record<string, CharacterEquipmentData>;
  data: CharacterEquipmentData;
  collection: Record<string, number>;
} {
  const next = { ...allData };
  const data = {
    ...getCharacterData(next, character),
  };
  return { next, data, collection: { ...data.collection } };
}
