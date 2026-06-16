import styles from "./styles.module.css";
import {
  RANK_COLORS,
  RANK_LABELS,
  SLOT_LABELS,
} from "@/utils/types/player/equipment";
import type { EquipmentDropInfo } from "@/hooks/battle/useBattleRewards";

type Props = {
  equipmentDrops: EquipmentDropInfo[];
};

export function EquipmentDrops({ equipmentDrops }: Props) {
  if (equipmentDrops.length === 0) return null;

  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>Equipamentos Dropados</h2>
      <div className={styles.dropsList}>
        {equipmentDrops.map((eq) => (
          <div key={eq.id} className={styles.dropItem}>
            <span
              className={styles.dropRank}
              style={{ color: RANK_COLORS[eq.rank] }}
            >
              {RANK_LABELS[eq.rank]}
            </span>
            <span className={styles.dropName}>
              {eq.name}
              {eq.enhance > 0 ? (
                <span className={styles.enhanceBadge}>+{eq.enhance}</span>
              ) : null}
            </span>
            <span className={styles.dropSlot}>
              ({SLOT_LABELS[eq.slot]})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
