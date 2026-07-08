import type { ChestOpenResult } from "@/hooks/useChestOpening";
import type { DailyChestResult } from "@/hooks/useDailyChest";
import { RANK_COLORS, RANK_LABELS, SLOT_LABELS } from "@/utils/types/player/equipment";
import type { EquipmentRank } from "@/utils/types/player/equipment";
import styles from "./styles.module.css";

type Props = {
  result: ChestOpenResult | DailyChestResult;
  isDaily: boolean;
  onClose: () => void;
};

export function ChestRewards({ result, isDaily, onClose }: Props) {
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
        className={isDaily ? "dailyButton" : "InventoryButton"}
        onClick={onClose}
      >
        Fechar
      </button>
    </div>
  );
}
