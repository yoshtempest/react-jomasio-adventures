import { useMemo, useRef, useState } from "react";
import { useInventory } from "@/contexts/InventoryContext";
import { useInventoryMenu } from "@/hooks/menu/useInventory";
import type { FilterConfig } from "@/utils/types/inventory/filterConfig";
import { useChestOpening } from "@/hooks/chest/useChestOpening";
import { useDailyChest } from "@/hooks/chest/useDailyChest";
import styles from "./styles.module.css";
import { ITEMS } from "@/data/items";
import { Chest } from "./Chest";
import { FilterBar } from "./FilterBar";
import { ListItem } from "./ListItem";
import { RewardsView } from "./RewardsView";
import { useItemEffect } from "@/gameRules/items/useItem";
import { FILTER_LABELS } from "@/data/inventory/labels";
import { useCharacterProgress } from "@/contexts/CharacterProgressContext";
import { CHARACTERS } from "@/utils/types/player/player";
import type { InventoryItem } from "@/utils/types/player/inventory";
import { useMenuSFX } from "@/hooks/menu/useMenuSFX";
import { useStableCallback } from "@/hooks/useStableCallback";
import { useSFXPool } from "@/hooks/menu/useSFXPool";
import { useConsumeItem } from "@/hooks/menu/useConsumeItem";
import { useItemControls } from "@/hooks/menu/useItemControls";
import { useRewardsControls } from "@/hooks/menu/useRewardsControls";

const CURRENCY_IDS = ["kwanzas", "hypercoin"] as const;

export function Inventory() {
  const { items, maxSlots } = useInventory();
  const { progress } = useCharacterProgress();
  const listRef = useRef<HTMLUListElement>(null);
  const [filterType, setFilterType] = useState<string>("all");

  const totalCoins = CHARACTERS.reduce(
    (sum, c) => sum + (progress[c]?.coins ?? 0),
    0,
  );
  const totalHyperCoins = CHARACTERS.reduce(
    (sum, c) => sum + (progress[c]?.hyperCoins ?? 0),
    0,
  );

  const currencyItems = useMemo<InventoryItem[]>(
    () => [
      { id: "kwanzas" as ItemId, qty: totalCoins },
      { id: "hypercoin" as ItemId, qty: totalHyperCoins },
    ],
    [totalCoins, totalHyperCoins],
  );

  const itemsWithCurrency = useMemo(
    () => [...currencyItems, ...items],
    [currencyItems, items],
  );

  const filteredItems = useMemo(
    () =>
      filterType === "all"
        ? itemsWithCurrency
        : itemsWithCurrency.filter((item) => {
            const itemData = item ? ITEMS[item.id as keyof typeof ITEMS] : null;
            return itemData?.type === filterType;
          }),
    [filterType, itemsWithCurrency],
  );

  const filterConfig = useMemo<FilterConfig | null>(
    () => ({
      labels: FILTER_LABELS,
      active: filterType,
      onChange: (type) => setFilterType(type),
      filteredItems,
    }),
    [filterType, filteredItems],
  );

  const dailyChest = useDailyChest();

  const { selectedIndex, filterFocused, chestFocused } = useInventoryMenu(
    true,
    listRef,
    filterConfig,
    dailyChest.isReady,
    dailyChest.open,
  );

  const {
    openPlayerChest,
    lastResult: chestLastResult,
    setLastResult,
    lastOpened,
    otherChestExists,
    openNextChest,
  } = useChestOpening();
  const { playMove, playSelect } = useMenuSFX();

  const { playSFX } = useSFXPool();
  const { getEffect } = useItemEffect({ playSFX });
  const { consumeItemRef } = useConsumeItem();

  const [rewardOptionIndex, setRewardOptionIndex] = useState(0);
  const [rejectedIndex, setRejectedIndex] = useState<number | null>(null);
  const [showNoKeyPopup, setShowNoKeyPopup] = useState(false);

  const hasOtherChest = !!(
    chestLastResult &&
    otherChestExists(chestLastResult.tier as unknown as ItemId)
  );
  const chestRewardsVisible = !!(dailyChest.lastResult || chestLastResult);
  const rewardOptionCount = chestRewardsVisible ? (hasOtherChest ? 2 : 1) : 0;

  const closeRewards = useStableCallback(() => {
    if (dailyChest.lastResult) {
      dailyChest.setLastResult(null);
    } else {
      setLastResult(null);
    }
  });

  const selectedItem = filteredItems[selectedIndex];
  const selectedItemData = selectedItem
    ? ITEMS[selectedItem.id as keyof typeof ITEMS]
    : null;

  const isChestSelected = selectedItemData?.type === "chest";
  const isConsumableSelected =
    selectedItemData?.type === "consumable" ||
    selectedItemData?.type === "food";
  const isMapSelected = selectedItemData?.type === "map";
  const isMountSelected = selectedItemData?.type === "mount";
  const isTeleportSelected = selectedItemData?.type === "teleport";

  const tier =
    isChestSelected && selectedItem
      ? (selectedItem.id.replace("_chest", "") as NPCClass)
      : null;
  const keyId = tier ? (`${tier}_key` as ItemId) : null;

  useRewardsControls({
    chestRewardsVisible,
    rewardOptionCount,
    lastOpened,
    chestLastResult,
    playMove,
    playSelect,
    closeRewards,
    openNextChest,
    onRewardOptionChange: setRewardOptionIndex,
  });

  useItemControls({
    filterFocused,
    chestFocused,
    selectedItem,
    isConsumableSelected,
    isChestSelected,
    isMapSelected,
    isMountSelected,
    isTeleportSelected,
    keyId,
    items,
    openPlayerChest,
    getEffect,
    consumeItem: consumeItemRef.current,
    onReject: () => {
      setRejectedIndex(selectedIndex);
      setTimeout(() => setRejectedIndex(null), 1500);
    },
    onNoKey: () => {
      setShowNoKeyPopup(true);
      setTimeout(() => setShowNoKeyPopup(false), 2000);
    },
  });

  const rewardsVisible = !!(dailyChest.lastResult || chestLastResult);
  if (rewardsVisible) {
    return (
      <RewardsView
        dailyResult={dailyChest.lastResult}
        chestResult={chestLastResult}
        hasOtherChest={hasOtherChest}
        rewardOptionIndex={rewardOptionIndex}
        rewardOptionCount={rewardOptionCount}
        lastOpened={lastOpened}
        onSelect={setRewardOptionIndex}
        onCloseDaily={() => dailyChest.setLastResult(null)}
        onCloseChest={() => setLastResult(null)}
        onOpenNextChest={openNextChest}
      />
    );
  }

  const listItems =
    filterType === "all"
      ? (Array.from({ length: maxSlots }, (_, i) => {
          if (i < CURRENCY_IDS.length) return currencyItems[i];
          return items[i - CURRENCY_IDS.length];
        }) as (typeof items)[number][])
      : filteredItems;

  return (
    <div className="containerOfNavbar">
      <Chest
        isFocused={chestFocused}
        isReady={dailyChest.isReady}
        timeLeft={dailyChest.timeLeft}
        onOpen={dailyChest.open}
      />

      <FilterBar
        filterType={filterType}
        filterFocused={filterFocused}
        onFilterChange={setFilterType}
      />

      <ul ref={listRef} className={styles.list}>
        {listItems.map((item, index) =>
          item ? (
            <ListItem
              key={index}
              item={item}
              isSelected={index === selectedIndex}
              rejected={index === rejectedIndex}
            />
          ) : (
            <li key={index} className="InventoryItem" />
          ),
        )}
      </ul>

      {showNoKeyPopup && <div className={styles.noKeyPopup}>Sem chave</div>}
    </div>
  );
}
