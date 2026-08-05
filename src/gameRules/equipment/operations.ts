import { MAX_ACCESSORIES } from "@/utils/types/player/equipment";
import { getEquipmentById } from "@/data/equipment";
import {
  colKey,
  getCharacterData,
  type CharacterEquipmentData,
} from "@/data/equipment/storage";
import {
  PET_STAR_MAX,
  enhanceFromPetStars,
} from "@/data/characters/petProgress";

export function equipItem(
  allData: Record<string, CharacterEquipmentData>,
  character: CharacterId,
  id: EquipmentId,
  enhance: number = 0,
): Record<string, CharacterEquipmentData> | null {
  const item = getEquipmentById(id);
  if (!item) return null;
  const key = colKey(id, enhance);

  const next = { ...allData };
  const data = {
    ...getCharacterData(
      next as Record<string, CharacterEquipmentData>,
      character,
    ),
  };
  const collection = { ...data.collection };

  if (!collection[key] || collection[key] <= 0) return null;

  collection[key] -= 1;
  if (collection[key] <= 0) delete collection[key];

  if (item.slot === "accessory") {
    const extras = data.equipped.accessories;

    if (!data.equipped.accessory) {
      next[character] = {
        equipped: { ...data.equipped, accessory: { id, enhance } },
        collection,
      } as CharacterEquipmentData;
      return next;
    }

    if (extras.length >= MAX_ACCESSORIES) {
      return null;
    }

    next[character] = {
      equipped: { ...data.equipped, accessories: [...extras, { id, enhance }] },
      collection,
    } as CharacterEquipmentData;
    return next;
  }

  const oldInfo = data.equipped[item.slot];
  const equipped = { ...data.equipped, [item.slot]: { id, enhance } };

  if (oldInfo) {
    const oldKey = colKey(oldInfo.id, oldInfo.enhance);
    collection[oldKey] = (collection[oldKey] ?? 0) + 1;
  }

  next[character] = { equipped, collection } as CharacterEquipmentData;
  return next;
}

export function unequipItem(
  allData: Record<string, CharacterEquipmentData>,
  character: CharacterId,
  slot: EquipmentSlot,
): Record<string, CharacterEquipmentData> | null {
  const next = { ...allData };
  const data = {
    ...getCharacterData(
      next as Record<string, CharacterEquipmentData>,
      character,
    ),
  };

  if (slot === "accessory") {
    const extras = data.equipped.accessories;
    if (extras.length > 0) {
      const lastInfo = extras[extras.length - 1];
      const collection = { ...data.collection };
      const oldKey = colKey(lastInfo.id, lastInfo.enhance);
      collection[oldKey] = (collection[oldKey] ?? 0) + 1;

      next[character] = {
        equipped: { ...data.equipped, accessories: extras.slice(0, -1) },
        collection,
      } as CharacterEquipmentData;
      return next;
    }
  }

  const oldInfo = data.equipped[slot];
  if (!oldInfo) return null;

  const collection = { ...data.collection };
  const oldKey = colKey(oldInfo.id, oldInfo.enhance);
  collection[oldKey] = (collection[oldKey] ?? 0) + 1;

  next[character] = {
    equipped: { ...data.equipped, [slot]: null },
    collection,
  } as CharacterEquipmentData;
  return next;
}

export function unequipAccessoryAt(
  allData: Record<string, CharacterEquipmentData>,
  character: CharacterId,
  index: number,
): Record<string, CharacterEquipmentData> | null {
  const next = { ...allData };
  const data = {
    ...getCharacterData(
      next as Record<string, CharacterEquipmentData>,
      character,
    ),
  };

  const extras = data.equipped.accessories;
  if (index < 0 || index >= extras.length) return null;

  const info = extras[index];
  const collection = { ...data.collection };
  const oldKey = colKey(info.id, info.enhance);
  collection[oldKey] = (collection[oldKey] ?? 0) + 1;

  next[character] = {
    equipped: {
      ...data.equipped,
      accessories: extras.filter((_, i) => i !== index),
    },
    collection,
  } as CharacterEquipmentData;
  return next;
}

export function addDrop(
  allData: Record<string, CharacterEquipmentData>,
  character: CharacterId,
  id: EquipmentId,
  enhance: number = 0,
): Record<string, CharacterEquipmentData> {
  const key = colKey(id, enhance);
  const next = { ...allData };
  const data = {
    ...getCharacterData(
      next as Record<string, CharacterEquipmentData>,
      character,
    ),
  };
  const collection = { ...data.collection };
  collection[key] = (collection[key] ?? 0) + 1;
  next[character] = { ...data, collection } as CharacterEquipmentData;
  return next;
}

export function fusePets(
  allData: Record<string, CharacterEquipmentData>,
  character: CharacterId,
  petId: EquipmentId,
  stars: number,
): Record<string, CharacterEquipmentData> | null {
  const item = getEquipmentById(petId);
  if (!item || item.slot !== "pet") return null;
  if (stars < 1 || stars >= PET_STAR_MAX) return null;

  const sourceEnhance = enhanceFromPetStars(stars);
  const targetEnhance = sourceEnhance + 1;

  const next = { ...allData };
  const data = {
    ...getCharacterData(
      next as Record<string, CharacterEquipmentData>,
      character,
    ),
  };
  const collection = { ...data.collection };

  const sourceKey = colKey(petId, sourceEnhance);
  if ((collection[sourceKey] ?? 0) < 2) return null;

  const equippedPet = data.equipped.pet;
  if (
    equippedPet &&
    equippedPet.id === petId &&
    equippedPet.enhance === sourceEnhance
  ) {
    return null;
  }

  collection[sourceKey] -= 2;
  if (collection[sourceKey] <= 0) delete collection[sourceKey];

  const targetKey = colKey(petId, targetEnhance);
  collection[targetKey] = (collection[targetKey] ?? 0) + 1;

  next[character] = {
    equipped: data.equipped,
    collection,
  } as CharacterEquipmentData;
  return next;
}
