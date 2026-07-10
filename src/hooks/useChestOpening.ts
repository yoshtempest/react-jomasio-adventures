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
  const [lastOpened, setLastOpened] = useState<{ chestId: ItemId; keyId: ItemId } | null>(null);

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
        addItem({ id: mat.id as ItemId, qty: mat.qty });
      }
      for (const eq of result.equipment) {
        addDrop(player.character, eq.id, eq.enhance);
      }

      removeItem(chestItemId);
      removeItem(keyId);

      const openResult: ChestOpenResult = { ...result, tier };
      setLastResult(openResult);
      setLastOpened({ chestId: chestItemId, keyId });
      return openResult;
    },
    [items, player.character, addDrop, addItem, removeItem],
  );

  const otherChestExists = useCallback(
    (currentChestId?: ItemId) =>
      items.some(
        (i) =>
          i.id.endsWith("_chest") &&
          i.id !== currentChestId &&
          items.some((k) => k.id === `${i.id.replace("_chest", "")}_key`),
      ),
    [items],
  );

  const openNextChest = useCallback(
    (excludeChestId: ItemId) => {
      const chest = items.find(
        (i) =>
          i.id.endsWith("_chest") &&
          i.id !== excludeChestId &&
          items.some((k) => k.id === `${i.id.replace("_chest", "")}_key`),
      );
      if (!chest) return null;
      return openPlayerChest(chest.id as ItemId);
    },
    [items, openPlayerChest],
  );

  return {
    openPlayerChest,
    lastResult,
    setLastResult,
    lastOpened,
    otherChestExists,
    openNextChest,
  };
}
