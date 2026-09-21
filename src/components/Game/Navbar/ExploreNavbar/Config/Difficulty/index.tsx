import { ChevronLeft, ChevronRight } from "lucide-react";
import styles from "@/components/Game/Navbar/ExploreNavbar/Config/styles.module.css";
import { DIFFICULTY_LABEL } from "@/data/npc";

type Props = {
  selectedIndex: number;
  selectedColumn: number;
  activeDifficulty: NpcDifficulty;
  onPrev: () => void;
  onNext: () => void;
};

export function DifficultySection({
  selectedIndex,
  selectedColumn,
  activeDifficulty,
  onPrev,
  onNext,
}: Props) {
  const isSelected = selectedColumn === 0 && selectedIndex === 0;

  return (
    <div className={styles.difficultyContainer}>
      <h2 className={styles.marginTop}>Dificuldade:</h2>

      <div className={styles.difficultySelector}>
        {isSelected && <span className={styles.cursor}>▼</span>}

        <button
          type="button"
          className={`${styles.triangle} ${styles.triangleBlink}`}
          onClick={onPrev}
          aria-label="Dificuldade anterior"
        >
          <ChevronLeft size={28} />
        </button>

        <div
          className={`${styles.item} ${styles.active} ${isSelected ? styles.selected : ""}`}
        >
          <h2>
            {(DIFFICULTY_LABEL[activeDifficulty] ?? activeDifficulty).toUpperCase()}
          </h2>
        </div>

        <button
          type="button"
          className={`${styles.triangle} ${styles.triangleBlink}`}
          onClick={onNext}
          aria-label="Próxima dificuldade"
        >
          <ChevronRight size={28} />
        </button>
      </div>
    </div>
  );
}