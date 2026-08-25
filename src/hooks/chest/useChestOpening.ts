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

/**
 * Desfecho de uma tentativa de abrir baú.
 *
 * `inventoryFull` existe porque baú e chave são consumidos na abertura:
 * sem esse estado, um drop que não coubesse na mochila sumia junto com
 * os dois itens gastos para obtê-lo.
 */
export type ChestOpenOutcome =
  | { status: "opened"; result: ChestOpenResult }
  | { status: "unavailable" }
  | { status: "inventoryFull" };

const UNAVAILABLE: ChestOpenOutcome = { status: "unavailable" };

export function useChestOpening() {
  const { player } = usePlayer();
  const { addDrop } = useEquipment();
  const { addItem, removeItem, items, hasSpaceFor } = useInventory();
  const { progressDailyWeekly } = useQuests();
  const { playSound } = useSoundEffects();
  const [lastResult, setLastResult] = useState<ChestOpenResult | null>(null);
  const [lastOpened, setLastOpened] = useState<{
    chestId: ItemId;
    keyId: ItemId;
  } | null>(null);

  const openPlayerChest = useCallback(
    (chestItemId: ItemId): ChestOpenOutcome => {
      if (!isChestItem(chestItemId)) return UNAVAILABLE;
      const chestItem = items.find((i) => i.id === chestItemId);
      if (!chestItem) return UNAVAILABLE;

      const tier = CHEST_TIER_BY_ITEM[chestItemId];
      const keyId = getKeyIdForChest(chestItemId);

      const keyItem = items.find((i) => i.id === keyId);
      if (!keyItem) return UNAVAILABLE;

      const result = openChest(tier);

      const materials = result.materials.map((mat) => ({
        id: mat.id as ItemId,
        qty: mat.qty,
      }));

      if (!hasSpaceFor(materials)) return { status: "inventoryFull" };

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
      return { status: "opened", result: openResult };
    },
    [
      items,
      hasSpaceFor,
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
    (excludeChestId?: ItemId): ChestOpenOutcome => {
      const chest = items.find((i) => {
        if (!isChestItem(i.id) || i.id === excludeChestId) return false;
        const keyId = getKeyIdForChest(i.id);
        return items.some((k) => k.id === keyId);
      });
      if (!chest) return UNAVAILABLE;
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
