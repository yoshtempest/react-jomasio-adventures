import { useState, useCallback } from "react";
import { usePlayer } from "@/contexts/PlayerContext";
import { useEquipment } from "@/contexts/EquipmentContext";
import { useInventory } from "@/contexts/InventoryContext";
import { openChest, type ChestDropResult } from "@/data/items/chests";

export type ChestOpenResult = ChestDropResult & {
  tier: NPCClass;
};

export function useChestOpening() {
  const { player } = usePlayer();
  const { addDrop } = useEquipment();
  const { addItem, removeItem, items } = useInventory();
  const [lastResult, setLastResult] = useState<ChestOpenResult | null>(null);

  const openPlayerChest = useCallback(
    (chestItemId: ItemId): ChestOpenResult | null => {
      const chestItem = items.find((i) => i.id === chestItemId);
      if (!chestItem) return null;

      const tier = chestItemId.replace("_chest", "") as NPCClass;
      const keyId = `${tier}_key` as ItemId;

      const keyItem = items.find((i) => i.id === keyId);
      if (!keyItem) return null;

      const result = openChest(tier);

      for (const mat of result.materials) {
        addItem({ id: mat.id as ItemId, name: mat.name, type: "material", qty: mat.qty });
      }
      for (const eq of result.equipment) {
        addDrop(player.character, eq.id, eq.enhance);
      }

      removeItem(chestItemId);
      removeItem(keyId);

      const openResult: ChestOpenResult = { ...result, tier };
      setLastResult(openResult);
      return openResult;
    },
    [items, player.character, addDrop, addItem, removeItem],
  );

  return { openPlayerChest, lastResult, setLastResult };
}
