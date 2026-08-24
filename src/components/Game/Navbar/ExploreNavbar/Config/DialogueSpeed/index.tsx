import styles from "../styles.module.css";
import { DIALOGUE_SPEED_LIST, SPEED_LABEL } from "@/utils/settings";
import type { DialogueSpeed } from "@/utils/settings";

type Props = {
  selectedIndex: number;
  selectedColumn: number;
  activeSpeed: DialogueSpeed;
};

export function DialogueSpeedSection({
  selectedIndex,
  selectedColumn,
  activeSpeed,
}: Props) {
  return (
    <div className={styles.speedContainer}>
      <h2 className={styles.marginTop}>Diálogo:</h2>
      <div className={styles.speedOptions}>
        {DIALOGUE_SPEED_LIST.map((speed, index) => {
          const isSelected = selectedColumn === 1 && index === selectedIndex;
          const isActive = speed === activeSpeed;
          return (
            <div
              key={speed}
              className={`${styles.item} ${isSelected ? styles.selected : ""} ${isActive ? styles.active : ""}`}
            >
              {isSelected && <span className={styles.cursor}>▼</span>}
              <h2>{SPEED_LABEL[speed].toUpperCase()}</h2>
            </div>
          );
        })}
      </div>
    </div>
  );
}
