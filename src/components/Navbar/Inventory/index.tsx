import { useEffect, useRef } from "react";
import { useInventory } from "@/contexts/InventoryContext";
import { useInventoryMenu } from "@/hooks/menu/useInventory";
import { useChestOpening } from "@/hooks/useChestOpening";
import { useDailyChest } from "@/hooks/useDailyChest";
import { useGameControls } from "@/contexts/GameControlsContext";
import styles from "./styles.module.css";
import { ITEMS } from "@/data/items";
import { Chest } from "./Chest";
import { ChestRewards } from "./ChestRewards";
import { activateXpBuff } from "@/utils/buffs/xpBuff";

export function Inventory() {
  const { items, maxSlots, removeItem } = useInventory();
  const listRef = useRef<HTMLUListElement>(null);
  const { selectedIndex } = useInventoryMenu(true, listRef);

  const { openPlayerChest, lastResult } = useChestOpening();
  const dailyChest = useDailyChest();
  const { pushControls, popControls } = useGameControls();

  const selectedItem = items[selectedIndex];
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

  function useConsumable(id: string) {
    if (id === "xp_potion") {
      activateXpBuff(10 * 60 * 1000);
    }
    removeItem(id as ItemId);
  }

  useEffect(() => {
    const controls = {
      onConfirm: () => {
        if (selectedItem && isConsumableSelected) {
          useConsumable(selectedItem.id);
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
  }, [isChestSelected, isConsumableSelected, selectedItem, keyId, items, openPlayerChest, pushControls, popControls]);

  if (dailyChest.lastResult) {
    return <ChestRewards />;
  }

  if (lastResult) {
    return <ChestRewards />;
  }

  return (
    <div className="containerOfNavbar">
      <Chest />

      <ul ref={listRef} className={styles.list}>
        {Array.from({ length: maxSlots }).map((_, index) => {
        const item = items[index];
        const itemData = item
          ? ITEMS[item.id as keyof typeof ITEMS]
          : null;

        return (
          <li
            key={index}
            className={`${styles.item} ${
              index === selectedIndex ? styles.active : ""
            }`}
          >
            {item && itemData && (
              <div className={styles.itemRow}>
                <img
                  className={styles.icon}
                  src={
                    itemData?.image
                      ? `${import.meta.env.BASE_URL}${itemData?.image.replace(/^\//, "")}`
                      : `${import.meta.env.BASE_URL}assets/items/${item.id}.svg`
                  }
                  alt={itemData?.name}
                />

                <div className={styles.info}>
                  <span className={styles.name}>
                    {itemData?.name}
                    {item.qty && item.qty > 0 && (
                      <span className="InventoryQty"> x{item.qty}</span>
                    )}
                  </span>

                  {itemData?.description && (
                    <span className={styles.description}>
                      {itemData?.description}
                    </span>
                  )}
                </div>

                {index === selectedIndex &&
                  itemData?.type === "chest" &&
                  (hasKey ? (
                    <button
                      className="InventoryButton"
                      onClick={() => openPlayerChest(item.id as ItemId)}
                    >
                      Abrir
                    </button>
                  ) : (
                    <span className={styles.noKey}>Sem chave</span>
                  ))}

                {index === selectedIndex && itemData?.type === "consumable" && (
                  <button
                    className="InventoryButton"
                    onClick={() => useConsumable(item.id)}
                  >
                    Usar
                  </button>
                )}
              </div>
            )}
          </li>
        );
      })}
      </ul>
    </div>
  );
}
