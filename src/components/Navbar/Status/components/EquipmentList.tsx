import { usePlayer } from "@/contexts/PlayerContext";
import { useEquipment } from "@/contexts/EquipmentContext";
import {
  EQUIPMENT_SLOTS,
  SLOT_LABELS,
  RANK_COLORS,
} from "@/utils/types/player/equipment";
import type { EquipmentSlot } from "@/utils/types/player/equipment";
import styles from "../styles.module.css";

export function EquipmentList() {
  const { player } = usePlayer();
  const character = player.character;
  const { getEquippedItem } = useEquipment();

  return (
    <div className={styles.flexColumn}>
      <h2 className={styles.title}>Equipamentos</h2>
      {(EQUIPMENT_SLOTS as EquipmentSlot[]).map((slot) => {
        const item = getEquippedItem(character, slot);
        const label = SLOT_LABELS[slot];
        return (
          <p key={slot} className={styles.fontSize}>
            {label}:{" "}
            {item ? (
              <span style={{ color: RANK_COLORS[item.rank] }}>
                {item.name}
              </span>
            ) : (
              <span className={styles.italic}>Vazio</span>
            )}
          </p>
        );
      })}
    </div>
  );
}
