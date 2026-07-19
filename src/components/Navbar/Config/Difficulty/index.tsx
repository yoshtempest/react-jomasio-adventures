import { Lock } from "lucide-react";
import styles from "../styles.module.css";
import { DIFFICULTY_LABEL } from "@/data/npc/difficultyLabels";

type Props = {
  difficultyList: string[];
  selectedIndex: number;
  selectedColumn: number;
};

export function DifficultySection({ difficultyList, selectedIndex, selectedColumn }: Props) {
  return (
    <div className={styles.difficultyContainer}>
      <h2 className={styles.marginTop}>Dificuldade:</h2>
      {difficultyList.map((diff, index) => {
        const isSelected = selectedColumn === 0 && index === selectedIndex;
        return (
          <div
            key={diff}
            className={`${styles.item} ${
              isSelected ? styles.selected : ""
            }`}
          >
            {isSelected && <span className={styles.cursor}>▼</span>}

            <h2>{DIFFICULTY_LABEL[diff].toUpperCase()}</h2>
          </div>
        );
      })}

      <div className={`${styles.item} ${styles.locked}`}>
        <div className={styles.chainLeft} />
        <Lock size={16} />
        <h2>INSANO</h2>
        <div className={styles.chainRight} />
      </div>
    </div>
  );
}
