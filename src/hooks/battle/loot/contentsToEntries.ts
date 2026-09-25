import { ITEMS } from "@/data/items";
import { SLOT_ICONS } from "@/utils/equipment/equipmentMenu";
import type {
  LootBagContents,
  LootNotifyEntry,
} from "@/utils/types/battle/loot";

export function contentsToEntries(contents: LootBagContents): LootNotifyEntry[] {
  const entries: LootNotifyEntry[] = [];

  if (contents.coins > 0) {
    entries.push({
      icon: ITEMS.kwanzas.image,
      qty: contents.coins,
      name: "kwanzas",
    });
  }

  if (contents.hyperCoins > 0) {
    entries.push({
      icon: ITEMS.hypercoin.image,
      qty: contents.hyperCoins,
      name: "hypercoins",
    });
  }

  for (const drop of contents.itemDrops) {
    const itemData = ITEMS[drop.id];
    entries.push({
      icon: drop.image ?? itemData?.image ?? `/assets/items/${drop.id}.svg`,
      qty: drop.qty,
      name: drop.name,
    });
  }

  for (const drop of contents.equipmentDrops) {
    entries.push({
      icon: SLOT_ICONS[drop.slot],
      qty: 1,
      name: `${drop.name} +${drop.enhance}`,
    });
  }

  if (contents.chestDrop) {
    const chestData = ITEMS[contents.chestDrop.id];
    entries.push({
      icon: chestData?.image ?? `/assets/items/${contents.chestDrop.id}.svg`,
      qty: 1,
      name: contents.chestDrop.name,
    });
  }

  if (contents.keyDrop) {
    const keyData = ITEMS[contents.keyDrop.id];
    entries.push({
      icon: keyData?.image ?? `/assets/items/${contents.keyDrop.id}.svg`,
      qty: 1,
      name: contents.keyDrop.name,
    });
  }

  return entries;
}