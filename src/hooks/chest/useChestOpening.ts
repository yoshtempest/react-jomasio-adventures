import { useState, useCallback } from "react";
import { usePlayer } from "@/contexts/PlayerContext";
import { useEquipment } from "@/contexts/EquipmentContext";
import { useInventory } from "@/contexts/InventoryContext";
import { useQuests } from "@/contexts/QuestContext";
import { useSoundEffects } from "@/contexts/SoundEffectsContext";
import { openChest, type ChestDropResult } from "@/data/items/chests";
import {
  CHEST_TIER_BY_ITEM,
  getKeyIdForChest,
  isChestItem,
} from "@/data/items/chestItems";

export type ChestOpenResult = ChestDropResult & {
  tier: NPCClass;
};

export function useChestOpening() {
  const { player } = usePlayer();
  const { addDrop } = useEquipment();
  const { addItem, removeItem, items } = useInventory();
  const { progressDailyWeekly } = useQuests();
  const { playSound } = useSoundEffects();
  const [lastResult, setLastResult] = useState<ChestOpenResult | null>(null);
  const [lastOpened, setLastOpened] = useState<{
    chestId: ItemId;
    keyId: ItemId;
  } | null>(null);

  const openPlayerChest = useCallback(
    (chestItemId: ItemId): ChestOpenResult | null => {
      if (!isChestItem(chestItemId)) return null;
      const chestItem = items.find((i) => i.id === chestItemId);
      if (!chestItem) return null;

      const tier = CHEST_TIER_BY_ITEM[chestItemId];
      const keyId = getKeyIdForChest(chestItemId);

      const keyItem = items.find((i) => i.id === keyId);
      if (!keyItem) return null;

      const result = openChest(tier);

      for (const mat of result.materials) {
        addItem({ id: mat.id as ItemId, qty: mat.qty });
        progressDailyWeekly("collect_material", mat.qty);
        if (mat.id === "hungry_essence")
          progressDailyWeekly("collect_hungry_essence", mat.qty);
        else if (mat.id === "goat_horn")
          progressDailyWeekly("collect_goat_horn", mat.qty);
      }
      for (const eq of result.equipment) {
        addDrop(player.character, eq.id, eq.enhance);
      }
      for (const pet of result.pets) {
        addDrop(player.character, pet.id, pet.enhance);
      }

      removeItem(chestItemId);
      removeItem(keyId);

      playSound("chestOpening");

      const openResult: ChestOpenResult = { ...result, tier };
      setLastResult(openResult);
      setLastOpened({ chestId: chestItemId, keyId });
      return openResult;
    },
    [
      items,
      player.character,
      addDrop,
      addItem,
      removeItem,
      playSound,
      progressDailyWeekly,
    ],
  );

  const otherChestExists = useCallback(
    (excludeTier?: NPCClass) =>
      items.some((i) => {
        if (!isChestItem(i.id)) return false;
        if (CHEST_TIER_BY_ITEM[i.id] === excludeTier) return false;
        const keyId = getKeyIdForChest(i.id);
        return items.some((k) => k.id === keyId);
      }),
    [items],
  );

  const openNextChest = useCallback(
    (excludeChestId?: ItemId) => {
      const chest = items.find((i) => {
        if (!isChestItem(i.id) || i.id === excludeChestId) return false;
        const keyId = getKeyIdForChest(i.id);
        return items.some((k) => k.id === keyId);
      });
      if (!chest) return null;
      return openPlayerChest(chest.id);
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
