import type { InventoryItem } from "@/utils/types/player/inventory";
import { ITEMS } from "@/data/items";

export function rollKeyDrop(
  npcClass: NPCClass,
  addItem: (item: InventoryItem) => boolean,
  chance: number,
): ChestKeyDropInfo | null {
  if (Math.random() >= chance) return null;

  const keyId = `${npcClass}_key` as const;
  const def = ITEMS[keyId as keyof typeof ITEMS];
  if (!def) return null;

  addItem({ id: def.id });
  const image = "image" in def ? def.image : undefined;
  return { id: def.id, name: def.name, image };
}
