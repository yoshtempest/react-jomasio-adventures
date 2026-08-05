import { useMemo } from "react";
import type { ChestOpenResult } from "@/hooks/chest/useChestOpening";
import type { DailyChestResult } from "@/hooks/chest/useDailyChest";
import {
  RANK_COLORS,
  RANK_LABELS,
  SLOT_LABELS,
} from "@/utils/types/player/equipment";
import type { EquipmentRank } from "@/utils/types/player/equipment";
import styles from "./styles.module.css";

type Props = {
  result: ChestOpenResult | DailyChestResult;
  isDaily: boolean;
  otherChestAvailable: boolean;
  selectedIndex: number;
  onSelect: (index: number) => void;
  onConfirm: () => void;
};

export function ChestRewards({
  result,
  isDaily,
  otherChestAvailable,
  selectedIndex,
  onSelect,
  onConfirm,
}: Props) {
  const options = useMemo(() => {
    const list = [];
    if (!isDaily && otherChestAvailable) {
      list.push("Abrir outro báu");
    }
    list.push("Fechar");
    return list;
  }, [isDaily, otherChestAvailable]);

  return (
    <div className="containerOfNavbar">
      <h3>{isDaily ? "Baú Diário — Aberto!" : "Baú Aberto!"}</h3>

      {result.materials.length > 0 && (
        <div className={styles.section}>
          <h4>Materiais</h4>
          {result.materials.map((m) => (
            <div key={m.id} className={styles.dropRow}>
              <span>{m.name}</span>
              <span className="InventoryQty">x{m.qty}</span>
            </div>
          ))}
        </div>
      )}

      {result.equipment.length > 0 && (
        <div className={styles.section}>
          <h4>Equipamentos</h4>
          {result.equipment.map((eq) => (
            <div key={eq.id} className={styles.dropRow}>
              <span style={{ color: RANK_COLORS[eq.rank as EquipmentRank] }}>
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

      {result.pets.length > 0 && (
        <div className={styles.section}>
          <h4>Pets</h4>
          {result.pets.map((pet) => (
            <div key={pet.id} className={styles.dropRow}>
              <span style={{ color: RANK_COLORS[pet.rank as EquipmentRank] }}>
                [{RANK_LABELS[pet.rank as EquipmentRank]}]
              </span>
              <span>{pet.name}</span>
              <span className={styles.slot}>
                ({SLOT_LABELS[pet.slot as EquipmentSlot]})
              </span>
            </div>
          ))}
        </div>
      )}

      {options.length === 1 ? (
        <button
          className={isDaily ? "dailyButton" : "InventoryButton"}
          onClick={onConfirm}
        >
          {options[0]}
        </button>
      ) : (
        <div className={styles.actions}>
          {options.map((opt, i) => (
            <button
              key={opt}
              className={`${isDaily ? "dailyButton" : "InventoryButton"} ${
                i === selectedIndex ? styles.actionSelected : ""
              }`}
              onClick={() => {
                onSelect(i);
                onConfirm();
              }}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
