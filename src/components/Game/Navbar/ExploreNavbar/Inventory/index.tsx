import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useInventory } from "@/contexts/InventoryContext";
import { useInventoryMenu } from "@/hooks/menu/useInventory";
import type { FilterConfig } from "@/utils/types/inventory/filterConfig";
import {
  useChestOpening,
  type ChestOpenOutcome,
} from "@/hooks/chest/useChestOpening";
import { useDailyChest } from "@/hooks/chest/useDailyChest";
import styles from "./styles.module.css";
import { ITEMS } from "@/data/items";
import {
  CHEST_OPENED_SPRITES,
  DAILY_CHEST_CLOSED_SPRITE,
  DAILY_CHEST_OPENED_SPRITE,
} from "@/data/items/chestItems";
import { Chest } from "./Chest";
import { FilterBar } from "./FilterBar";
import { ListItem } from "./ListItem";
import { RewardsView } from "./RewardsView";
import { ChestOpeningAnimation } from "./ChestOpeningAnimation";
import { useItemEffect } from "@/hooks/items/useItemEffect";
import { FILTER_LABELS } from "@/data/inventory/labels";
import { useCharacterProgress } from "@/contexts/CharacterProgressContext";
import { CHARACTERS } from "@/data/characters/list";
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
      { id: "kwanzas", qty: totalCoins },
      { id: "hypercoin", qty: totalHyperCoins },
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
            const itemData = item ? ITEMS[item.id] : null;
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

  const [openingChest, setOpeningChest] = useState<{
    tier: NPCClass;
    isDaily: boolean;
  } | null>(null);

  const [popupMessage, setPopupMessage] = useState<string | null>(null);
  const popupTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (popupTimerRef.current) clearTimeout(popupTimerRef.current);
    };
  }, []);

  const flashPopup = useCallback((message: string) => {
    if (popupTimerRef.current) clearTimeout(popupTimerRef.current);
    setPopupMessage(message);
    popupTimerRef.current = setTimeout(() => setPopupMessage(null), 2000);
  }, []);

  const handleOpenDailyChest = () => {
    const outcome = dailyChest.open();
    if (outcome.status === "opened") {
      setOpeningChest({ tier: outcome.result.tier, isDaily: true });
    } else if (outcome.status === "inventoryFull") {
      flashPopup("Mochila cheia");
    }
  };

  const { selectedIndex, filterFocused, chestFocused } = useInventoryMenu(
    true,
    listRef,
    filterConfig,
    dailyChest.isReady,
    handleOpenDailyChest,
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

  const handleChestOutcome = (outcome: ChestOpenOutcome) => {
    if (outcome.status === "opened") {
      setOpeningChest({ tier: outcome.result.tier, isDaily: false });
    } else if (outcome.status === "inventoryFull") {
      flashPopup("Mochila cheia");
    }
  };

  const handleOpenPlayerChest = (id: ItemId) => {
    handleChestOutcome(openPlayerChest(id));
  };

  const handleOpenNextChest = (id?: ItemId) => {
    handleChestOutcome(openNextChest(id));
  };

  const hasOtherChest = !!(
    chestLastResult && otherChestExists(chestLastResult.tier)
  );
  const chestRewardsVisible =
    !!(dailyChest.lastResult || chestLastResult) && !openingChest;
  const rewardOptionCount = chestRewardsVisible ? (hasOtherChest ? 2 : 1) : 0;

  const closeRewards = useStableCallback(() => {
    if (dailyChest.lastResult) {
      dailyChest.setLastResult(null);
    } else {
      setLastResult(null);
    }
  });

  const selectedItem = filteredItems[selectedIndex];
  const selectedItemData = selectedItem ? ITEMS[selectedItem.id] : null;

  const isChestSelected = selectedItemData?.type === "chest";
  const isConsumableSelected =
    selectedItemData?.type === "consumable" ||
    selectedItemData?.type === "food";
  const isMapSelected = selectedItemData?.type === "map";
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
    playMove,
    playSelect,
    closeRewards,
    openNextChest: handleOpenNextChest,
    onRewardOptionChange: setRewardOptionIndex,
  });

  useItemControls({
    filterFocused,
    chestFocused,
    selectedItem,
    isConsumableSelected,
    isChestSelected,
    isMapSelected,
    isTeleportSelected,
    keyId,
    items,
    openPlayerChest: handleOpenPlayerChest,
    getEffect,
    consumeItem: consumeItemRef.current,
    onReject: () => {
      setRejectedIndex(selectedIndex);
      setTimeout(() => setRejectedIndex(null), 1500);
    },
    onNoKey: () => flashPopup("Sem chave"),
  });

  if (openingChest) {
    const closedSrc = openingChest.isDaily
      ? DAILY_CHEST_CLOSED_SPRITE
      : `/assets/items/chests/${openingChest.tier}.svg`;
    const openedSrc = openingChest.isDaily
      ? DAILY_CHEST_OPENED_SPRITE
      : CHEST_OPENED_SPRITES[openingChest.tier];
    return (
      <ChestOpeningAnimation
        closedSrc={closedSrc}
        openedSrc={openedSrc}
        onComplete={() => setOpeningChest(null)}
      />
    );
  }

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
        onOpenNextChest={handleOpenNextChest}
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
    <div className={`containerOfNavbar ${styles.container}`}>
      <div className={styles.leftPanel}>
        <Chest
          isFocused={chestFocused}
          isReady={dailyChest.isReady}
          timeLeft={dailyChest.timeLeft}
          onOpen={handleOpenDailyChest}
        />

        <FilterBar
          filterType={filterType}
          filterFocused={filterFocused}
          onFilterChange={setFilterType}
        />
      </div>

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

      {popupMessage && (
        <div className={styles.noKeyPopup}>{popupMessage}</div>
      )}
    </div>
  );
}
