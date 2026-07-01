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

export function ChestRewards() {
  const { items } = useInventory();
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
                <span className="InventoryQty">x{m.qty}</span>
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
          className="dailyButton"
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
                <span className="InventoryQty">x{m.qty}</span>
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

        <button className="InventoryButton" onClick={() => setLastResult(null)}>
          Fechar
        </button>
      </div>
    );
  }
}
