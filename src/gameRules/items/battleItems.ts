import { ITEMS } from "@/data/items";
import type { InventoryItem } from "@/utils/types/player/inventory";

const BATTLE_USABLE_TYPES = new Set(["consumable", "food"]);

export function isBattleUsableItem(id: ItemId): boolean {
  const itemType = ITEMS[id]?.type;
  return itemType != null && BATTLE_USABLE_TYPES.has(itemType);
}

export function getBattleItems(items: InventoryItem[]): InventoryItem[] {
  return items.filter((item) => isBattleUsableItem(item.id));
}
