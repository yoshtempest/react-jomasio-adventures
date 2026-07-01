import { useEffect, useRef } from "react";
import { useInventory } from "@/contexts/InventoryContext";
import { useInventoryMenu } from "@/hooks/menu/useInventory";
import { useChestOpening } from "@/hooks/useChestOpening";
import { useDailyChest } from "@/hooks/useDailyChest";
import { useGameControls } from "@/contexts/GameControlsContext";
import styles from "./styles.module.css";
import { ITEMS } from "@/data/items";
import { asset } from "@/utils/asset";

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function Chest() {
  const { items, maxSlots } = useInventory();
  const listRef = useRef<HTMLUListElement>(null);
  const { selectedIndex } = useInventoryMenu(true, listRef);

  const { openPlayerChest } = useChestOpening();
  const dailyChest = useDailyChest();
  const { pushControls, popControls } = useGameControls();

  const selectedItem = items[selectedIndex];
  const selectedItemData = selectedItem
    ? ITEMS[selectedItem.id as keyof typeof ITEMS]
    : null;

  const isChestSelected = selectedItemData?.type === "chest";

  const tier = isChestSelected && selectedItem
    ? (selectedItem.id.replace("_chest", "") as NPCClass)
    : null;
  const keyId = tier ? (`${tier}_key` as ItemId) : null;

  useEffect(() => {
    const controls = {
      onConfirm: () => {
        if (!isChestSelected || !selectedItem || !keyId) return false;
        if (!items.some((i) => i.id === keyId)) return false;
        openPlayerChest(selectedItem.id as ItemId);
        return true;
      },
    };

    pushControls(controls);
    return () => popControls();
  }, [isChestSelected, selectedItem, keyId, items, openPlayerChest, pushControls, popControls]);

  const slotsLabel =
    maxSlots === Infinity
      ? `${items.length} / ∞`
      : `${items.length} / ${maxSlots}`;
    
  return (
    <div className={styles.flexRow}>
      <h3>Inventário {slotsLabel}</h3>
      <div className={styles.dailyChest}>
        <div className={styles.dailyChestInfo}>
          <img className={styles.image} src={asset("/assets/items/chests/default.svg")}/>
          <span className={styles.dailyChestTitle}>Baú Diário - {dailyChest.isReady ? (
            <span className={styles.dailyChestReady}>Disponível!</span>
          ) : (
            <span className={styles.dailyChestTimer}>
              {formatTime(dailyChest.timeLeft)}
            </span>
          )}</span>
        </div>
        {dailyChest.isReady && (
          <button
            className="dailyButton"
            onClick={() => dailyChest.open()}
          >
            Abrir
          </button>
        )}
      </div>
    </div>
  )
}
