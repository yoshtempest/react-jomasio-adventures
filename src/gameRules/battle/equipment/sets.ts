import type { EquippedItems } from "@/utils/types/player/equipment";
import { getEquipmentById } from "@/data/equipment";
import { loadEquipped } from "@/data/equipment/storage";

export const SET_SLOTS: EquipmentSlot[] = [
  "weapon",
  "helmet",
  "chestplate",
  "pants",
  "boots",
  "accessory",
];

export const SET_MULTIPLIER = 1.5;

export function buildSetItemIds(equipped: EquippedItems): Set<string> {
  const setPieces: Record<string, string[]> = {};

  for (const slot of SET_SLOTS) {
    const info = equipped[slot];
    if (!info) continue;
    const item = getEquipmentById(info.id);
    if (!item?.set) continue;
    const pieces = (setPieces[item.set] ??= []);
    pieces.push(info.id);
  }

  for (const info of equipped.accessories) {
    const item = getEquipmentById(info.id);
    if (!item?.set) continue;
    const pieces = (setPieces[item.set] ??= []);
    pieces.push(info.id);
  }

  const setItemIds = new Set<string>();
  for (const ids of Object.values(setPieces)) {
    if (ids.length >= 3) {
      for (const id of ids) setItemIds.add(id);
    }
  }

  return setItemIds;
}

export function getActiveSetItemIds(character: CharacterId): Set<string> {
  return buildSetItemIds(loadEquipped(character));
}

export function getSetMultiplier(
  character: CharacterId,
  itemId: string,
): number {
  const definedItem = getEquipmentById(itemId);
  if (!definedItem?.set) return 1;

  const setItemIds = getActiveSetItemIds(character);
  return setItemIds.has(itemId) ? SET_MULTIPLIER : 1;
}
