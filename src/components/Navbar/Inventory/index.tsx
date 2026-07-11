import { useEffect, useMemo, useRef, useState } from "react";
import { useInventory } from "@/contexts/InventoryContext";
import { useInventoryMenu } from "@/hooks/menu/useInventory";
import type { FilterConfig } from "@/utils/types/inventory/filterConfig";
import { useChestOpening } from "@/hooks/useChestOpening";
import { useDailyChest } from "@/hooks/useDailyChest";
import { useGameControls } from "@/contexts/GameControlsContext";
import styles from "./styles.module.css";
import { ITEMS } from "@/data/items";
import { Chest } from "./Chest";
import { FilterBar } from "./FilterBar";
import { ListItem } from "./ListItem";
import { RewardsView } from "./RewardsView";
import { activateXpBuff, POTION_CONFIG } from "@/utils/buffs/xpBuff";
import { useAudio } from "@/contexts/AudioContext";
import { sfx } from "@/utils/paths";
import { FILTER_LABELS } from "@/data/inventory/labels";
import { useCharacterProgress } from "@/contexts/CharacterProgressContext";
import { CHARACTERS } from "@/utils/types/player/player";
import type { InventoryItem } from "@/utils/types/player/inventory";
import { circularNext, circularPrev } from "@/gameRules/menu/navigation";
import { useMenuSFX } from "@/hooks/menu/useMenuSFX";
import { useStableCallback } from "@/hooks/useStableCallback";

const CURRENCY_IDS = ["kwanzas", "hypercoin"] as const;

export function Inventory() {
  const { items, maxSlots, removeItem } = useInventory();
  const { progress } = useCharacterProgress();
  const listRef = useRef<HTMLUListElement>(null);
  const [filterType, setFilterType] = useState<string>("all");

  const totalCoins = CHARACTERS.reduce((sum, c) => sum + (progress[c]?.coins ?? 0), 0);
  const totalHyperCoins = CHARACTERS.reduce((sum, c) => sum + (progress[c]?.hyperCoins ?? 0), 0);

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
            const itemData = item
              ? ITEMS[item.id as keyof typeof ITEMS]
              : null;
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

  const { selectedIndex, filterFocused } = useInventoryMenu(
    true,
    listRef,
    filterConfig,
  );

  const filterFocusedRef = useRef(filterFocused);
  filterFocusedRef.current = filterFocused;

  const {
    openPlayerChest,
    lastResult: chestLastResult,
    setLastResult,
    lastOpened,
    otherChestExists,
    openNextChest,
  } = useChestOpening();
  const dailyChest = useDailyChest();
  const { pushControls, popControls } = useGameControls();
  const { sfxVolume } = useAudio();
  const { playMove, playSelect } = useMenuSFX();

  const [rewardOptionIndex, setRewardOptionIndex] = useState(0);
  const rewardOptionIndexRef = useRef(rewardOptionIndex);
  rewardOptionIndexRef.current = rewardOptionIndex;

  const hasOtherChest = !!(
    chestLastResult &&
    otherChestExists(chestLastResult.tier as unknown as ItemId)
  );
  const chestRewardsVisible = !!(dailyChest.lastResult || chestLastResult);
  const rewardOptionCount = chestRewardsVisible ? (hasOtherChest ? 2 : 1) : 0;

  const openNextChestRef = useRef(openNextChest);
  openNextChestRef.current = openNextChest;

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
  const isConsumableSelected = selectedItemData?.type === "consumable";

  const tier = isChestSelected && selectedItem
    ? (selectedItem.id.replace("_chest", "") as NPCClass)
    : null;
  const keyId = tier ? (`${tier}_key` as ItemId) : null;
  const hasKey = keyId ? items.some((i) => i.id === keyId) : false;

  const consumeItemRef = useRef<(id: string) => void>(() => {});
  consumeItemRef.current = function consumeItem(id: string) {
    const audio = sfx("/player/drinkingPotion.mp3");
    audio.volume = 0.6 * (sfxVolume / 100);
    audio.play().catch(() => {});
    const cfg = POTION_CONFIG[id];
    if (cfg) {
      activateXpBuff(cfg.durationMs, cfg.multiplier, id);
    }
    removeItem(id as ItemId);
  };

  useEffect(() => {
    if (!chestRewardsVisible) return;

    setRewardOptionIndex(0);

    const controls = {
      onLeft: () => {
        if (rewardOptionCount <= 1) return true;
        playMove();
        setRewardOptionIndex((prev) => circularPrev(prev, rewardOptionCount));
        return true;
      },
      onRight: () => {
        if (rewardOptionCount <= 1) return true;
        playMove();
        setRewardOptionIndex((prev) => circularNext(prev, rewardOptionCount));
        return true;
      },
      onConfirm: () => {
        playSelect();
        if (rewardOptionCount > 1 && rewardOptionIndexRef.current === 0) {
          openNextChestRef.current(lastOpened?.chestId ?? (chestLastResult?.tier as unknown as ItemId));
        } else {
          closeRewards();
        }
        return true;
      },
      onCancel: () => {
        playSelect();
        closeRewards();
        return true;
      },
    };

    pushControls(controls);
    return () => popControls();
  }, [
    chestRewardsVisible,
    rewardOptionCount,
    lastOpened,
    chestLastResult,
    playMove,
    playSelect,
    closeRewards,
    pushControls,
    popControls,
  ]);

  useEffect(() => {
    const controls = {
      onConfirm: () => {
        if (filterFocusedRef.current) return false;

        if (selectedItem && isConsumableSelected) {
          consumeItemRef.current(selectedItem.id);
          return true;
        }
        if (!isChestSelected || !selectedItem || !keyId) return false;
        if (!items.some((i) => i.id === keyId)) return false;
        openPlayerChest(selectedItem.id as ItemId);
        return true;
      },
    };

    pushControls(controls);
    return () => popControls();
  }, [
    isChestSelected,
    isConsumableSelected,
    selectedItem,
    keyId,
    items,
    openPlayerChest,
    pushControls,
    popControls,
  ]);

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
      ? Array.from({ length: maxSlots + CURRENCY_IDS.length }, (_, i) => {
          if (i < CURRENCY_IDS.length) return currencyItems[i];
          return items[i - CURRENCY_IDS.length];
        }) as (typeof items)[number][]
      : filteredItems;

  return (
    <div className="containerOfNavbar">
      <Chest />

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
              isChest={ITEMS[item.id as keyof typeof ITEMS]?.type === "chest"}
              hasKey={hasKey}
              onOpenChest={openPlayerChest}
              onUseItem={(id) => consumeItemRef.current(id)}
            />
          ) : (
            <li key={index} className="InventoryItem" />
          ),
        )}
      </ul>
    </div>
  );
}
