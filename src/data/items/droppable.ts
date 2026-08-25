import { ITEMS } from ".";

const STORY_ITEM_TYPES = ["key", "teleport", "map"] as const;

export function isDroppable(itemId: ItemId): boolean {
  const item = ITEMS[itemId];
  if (!item) return false;
  return !(STORY_ITEM_TYPES as readonly string[]).includes(item.type);
}
