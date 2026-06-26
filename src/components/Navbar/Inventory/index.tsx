import { useEffect, useRef } from "react";
import { useInventory } from "@/contexts/InventoryContext";
import { useInventoryMenu } from "@/hooks/menu/useInventory";
import { useChestOpening } from "@/hooks/useChestOpening";
import { useGameControls } from "@/contexts/GameControlsContext";
import { RANK_COLORS, RANK_LABELS, SLOT_LABELS } from "@/utils/types/player/equipment";
import type { EquipmentRank, EquipmentSlot } from "@/utils/types/player/equipment";
import styles from "./styles.module.css";

export function Inventory() {
  const { items, maxSlots } = useInventory();
  const listRef = useRef<HTMLUListElement>(null);
  const { selectedIndex } = useInventoryMenu(true, listRef);

  const { openPlayerChest, lastResult, setLastResult } = useChestOpening();
  const { pushControls, popControls } = useGameControls();

  const selectedItem = items[selectedIndex];
  const isChestSelected = selectedItem?.type === "chest";

  const tier = isChestSelected
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
      <h3>Inventário {slotsLabel}</h3>

      <ul ref={listRef} className={styles.list}>
        {items.map((item, index) => (
          <li
            key={item.id}
            className={`${styles.item} ${index === selectedIndex ? styles.active : ""}`}
          >
            <div className={styles.itemRow}>
              <img
                className={styles.icon}
                src={
                  item.image
                    ? `${import.meta.env.BASE_URL}${item.image.replace(/^\//, "")}`
                    : `${import.meta.env.BASE_URL}assets/items/${item.id}.svg`
                }
                alt={item.name}
              />
              <div className={styles.info}>
                <span className={styles.name}>
                  {item.name}
                  {item.qty && item.qty > 1 && (
                    <span className={styles.qty}> x{item.qty}</span>
                  )}
                </span>
                {item.description && (
                  <span className={styles.description}>{item.description}</span>
                )}
              </div>
              {index === selectedIndex && item.type === "chest" && (
                hasKey ? (
                  <button
                    className={styles.button}
                    onClick={() => openPlayerChest(item.id as ItemId)}
                  >
                    Abrir Baú
                  </button>
                ) : (
                  <span className={styles.noKey}>
                    Sem chave
                  </span>
                )
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
