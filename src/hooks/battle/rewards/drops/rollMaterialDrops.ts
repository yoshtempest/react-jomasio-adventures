import type { InventoryItem } from "@/utils/types/player/inventory";
import { ITEMS } from "@/data/items";
import {
  CRAFT_MATERIALS,
  rollCraftDrops,
  type MaterialId,
} from "@/data/items/crafting";

export function rollMaterialDrops(
  npcClass: NPCClass,
  npcType: string,
  addItem: (item: InventoryItem) => boolean,
): ItemDropInfo[] {
  const drops: ItemDropInfo[] = [];
  const materialDrops = rollCraftDrops(npcClass, npcType);

  for (const [materialId, qty] of Object.entries(materialDrops)) {
    const craftDef = CRAFT_MATERIALS[materialId as MaterialId];
    if (craftDef) {
      addItem({ id: craftDef.id, qty });
      drops.push({ id: craftDef.id, name: craftDef.name, qty });
      continue;
    }

    const def = ITEMS[materialId as keyof typeof ITEMS];
    if (!def) continue;

    const image = "image" in def ? def.image : undefined;
    addItem({ id: def.id, qty });
    drops.push({ id: def.id, name: def.name, qty, image });
  }

  return drops;
}
