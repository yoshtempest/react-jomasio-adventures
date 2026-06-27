import { useEffect, useRef } from "react";
import { useInventory } from "@/contexts/InventoryContext";
import { useInventoryMenu } from "@/hooks/menu/useInventory";
import { useChestOpening } from "@/hooks/useChestOpening";
import { useDailyChest } from "@/hooks/useDailyChest";
import { useGameControls } from "@/contexts/GameControlsContext";
import { RANK_COLORS, RANK_LABELS, SLOT_LABELS } from "@/utils/types/player/equipment";
import type { EquipmentRank, EquipmentSlot } from "@/utils/types/player/equipment";
import styles from "./styles.module.css";
import { ITEMS } from "@/data/items";

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function Inventory() {
  const { items, maxSlots } = useInventory();
  const listRef = useRef<HTMLUListElement>(null);
  const { selectedIndex } = useInventoryMenu(true, listRef);

  const { openPlayerChest, lastResult, setLastResult } = useChestOpening();
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
  const hasKey = keyId ? items.some((i) => i.id === keyId) : false;

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

  if (dailyChest.lastResult) {
    const r = dailyChest.lastResult;
    return (
      <div className="containerOfNavbar">
        <h3>Baú Diário — Aberto!</h3>

        {r.materials.length > 0 && (
          <div className={styles.section}>
            <h4>Materiais</h4>
            {r.materials.map((m) => (
              <div key={m.id} className={styles.dropRow}>
                <span>{m.name}</span>
                <span className={styles.qty}>x{m.qty}</span>
              </div>
            ))}
          </div>
        )}

        {r.equipment.length > 0 && (
          <div className={styles.section}>
            <h4>Equipamentos</h4>
            {r.equipment.map((eq) => (
              <div key={eq.id} className={styles.dropRow}>
                <span
                  style={{ color: RANK_COLORS[eq.rank as EquipmentRank] }}
                >
                  [{RANK_LABELS[eq.rank as EquipmentRank]}]
                </span>
                <span>{eq.name}</span>
                <span className={styles.slot}>
                  ({SLOT_LABELS[eq.slot as EquipmentSlot]})
                </span>
                {eq.enhance > 0 && (
                  <span className={styles.enhance}>+{eq.enhance}</span>
                )}
              </div>
            ))}
          </div>
        )}

        <button
          className={styles.dailyButton}
          onClick={() => dailyChest.setLastResult(null)}
        >
          Fechar
        </button>
      </div>
    );
  }

  if (lastResult) {
    return (
      <div className="containerOfNavbar">
        <h3>Baú Aberto!</h3>

        {lastResult.materials.length > 0 && (
          <div className={styles.section}>
            <h4>Materiais</h4>
            {lastResult.materials.map((m) => (
              <div key={m.id} className={styles.dropRow}>
                <span>{m.name}</span>
                <span className={styles.qty}>x{m.qty}</span>
              </div>
            ))}
          </div>
        )}

        {lastResult.equipment.length > 0 && (
          <div className={styles.section}>
            <h4>Equipamentos</h4>
            {lastResult.equipment.map((eq) => (
              <div key={eq.id} className={styles.dropRow}>
                <span
                  style={{ color: RANK_COLORS[eq.rank as EquipmentRank] }}
                >
                  [{RANK_LABELS[eq.rank as EquipmentRank]}]
                </span>
                <span>{eq.name}</span>
                <span className={styles.slot}>
                  ({SLOT_LABELS[eq.slot as EquipmentSlot]})
                </span>
                {eq.enhance > 0 && (
                  <span className={styles.enhance}>+{eq.enhance}</span>
                )}
              </div>
            ))}
          </div>
        )}

        <button className={styles.button} onClick={() => setLastResult(null)}>
          Fechar
        </button>
      </div>
    );
  }

  return (
    <div className="containerOfNavbar">
      <div className={styles.flexRow}>
        <h3>Inventário {slotsLabel}</h3>
        <div className={styles.dailyChest}>
          <div className={styles.dailyChestInfo}>
            <img className={styles.image} src="public/assets/items/chests/default.svg"/>
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
              className={styles.dailyButton}
              onClick={() => dailyChest.open()}
            >
              Abrir
            </button>
          )}
        </div>
      </div>

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
                      <span className={styles.qty}> x{item.qty}</span>
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
                      className={styles.button}
                      onClick={() => openPlayerChest(item.id as ItemId)}
                    >
                      Abrir
                    </button>
                  ) : (
                    <span className={styles.noKey}>Sem chave</span>
                  ))}
              </div>
            )}
          </li>
        );
      })}
      </ul>
    </div>
  );
}
