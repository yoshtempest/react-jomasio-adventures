import styles from "./styles.module.css";
import {
  RANK_COLORS,
  RANK_LABELS,
  SLOT_LABELS,
} from "@/data/equipment/definitions";
import {
  getItemResistances,
  HEAT_RESISTANCE_LABEL,
  COLD_RESISTANCE_LABEL,
  BLIND_RESISTANCE_LABEL,
  RESISTANCE_REDUCTION_PER_PIECE_PCT,
} from "@/gameRules/battle/equipment";
import type { EquipmentDropInfo } from "@/hooks/battle/rewards/useRewards";

type Props = {
  equipmentDrops: EquipmentDropInfo[];
};

export function EquipmentDrops({ equipmentDrops }: Props) {
  if (equipmentDrops.length === 0) return null;

  return (
    <div className="section">
      <h2 className="sectionTitle">Equipamentos Dropados</h2>
      <div className="dropsList">
        {equipmentDrops.map((eq) => {
          const res = getItemResistances(eq.id, eq.enhance);
          const labels: string[] = [];
          if (res.heat)
            labels.push(
              `${HEAT_RESISTANCE_LABEL} ${RESISTANCE_REDUCTION_PER_PIECE_PCT}%`,
            );
          if (res.cold)
            labels.push(
              `${COLD_RESISTANCE_LABEL} ${RESISTANCE_REDUCTION_PER_PIECE_PCT}%`,
            );
          if (res.blind)
            labels.push(
              `${BLIND_RESISTANCE_LABEL} ${RESISTANCE_REDUCTION_PER_PIECE_PCT}%`,
            );

          return (
            <div key={eq.id} className="dropItem">
              <span
                className={styles.dropRank}
                style={{ color: RANK_COLORS[eq.rank] }}
              >
                {RANK_LABELS[eq.rank]}
              </span>
              <span className="dropName">
                {eq.name}
                {eq.enhance > 0 ? (
                  <span className={styles.enhanceBadge}>+{eq.enhance}</span>
                ) : null}
              </span>
              {labels.length > 0 && (
                <span className={styles.resistanceBadges}>
                  {labels.map((l) => (
                    <span key={l} className={styles.resistanceBadge}>
                      {l}
                    </span>
                  ))}
                </span>
              )}
              <span className={styles.dropSlot}>({SLOT_LABELS[eq.slot]})</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
