import type { InventoryItem } from "@/utils/types/player/inventory";
import { ITEMS } from "@/data/items";
import { NPC_CARDS, rollCardDrop } from "@/data/npc";


export function rollNpcCardDrop(
  npcType: string,
  addItem: (item: InventoryItem) => boolean,
): ItemDropInfo | null {
  const card = rollCardDrop(npcType);
  if (!card) return null;

  const def = NPC_CARDS[card.npcType];
  if (!def) return null;

  const itemDef = ITEMS[card.id as keyof typeof ITEMS];
  if (!itemDef) return null;
  const image = "image" in itemDef ? itemDef.image : undefined;

  addItem({ id: itemDef.id });
  return { id: itemDef.id, name: card.name, qty: 1, image };
}
