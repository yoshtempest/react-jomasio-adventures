import styles from "../styles.module.css";
import { DIALOGUE_SPEED_LIST, SPEED_LABEL } from "@/utils/settings";

type Props = {
  selectedIndex: number;
  selectedColumn: number;
};

export function DialogueSpeedSection({ selectedIndex, selectedColumn }: Props) {
  return (
    <div className={styles.speedContainer}>
      <h2 className={styles.marginTop}>Diálogo:</h2>
      <div className={styles.speedOptions}>
        {DIALOGUE_SPEED_LIST.map((speed, index) => {
          const isSelected = selectedColumn === 1 && index === selectedIndex;
          return (
            <div
              key={speed}
              className={`${styles.item} ${isSelected ? styles.selected : ""}`}
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
