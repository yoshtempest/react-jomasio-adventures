import styles from "../styles.module.css";
import InstallButton from "@/components/PWA";
import { UpdateButton } from "../UpdateButton";

type Props = {
  selectedColumn: number;
  selectedIndex: number;
  showQuestIndicator: boolean;
};

export function HelpSection({
  selectedColumn,
  selectedIndex,
  showQuestIndicator,
}: Props) {
  return (
    <div className={styles.flexColumn}>
      <h2 className={styles.marginTop}>Ajuda:</h2>
      <div
        className={`${styles.tutorialButton} ${
          selectedColumn === 2 && selectedIndex === 0 ? styles.selected : ""
        }`}
      >
        {selectedColumn === 2 && selectedIndex === 0 && (
          <span className={styles.cursor}>▼</span>
        )}

        <h2>Indicador de Missões: {showQuestIndicator ? "ON" : "OFF"}</h2>
      </div>
      <div
        className={`${styles.tutorialButton} ${
          selectedColumn === 2 && selectedIndex === 1 ? styles.selected : ""
        }`}
      >
        {selectedColumn === 2 && selectedIndex === 1 && (
          <span className={styles.cursor}>▼</span>
        )}

        <h2>Ver Tutorial</h2>
      </div>
      <div
        className={`${styles.tutorialButton} ${
          selectedColumn === 2 && selectedIndex === 2 ? styles.selected : ""
        }`}
      >
        {selectedColumn === 2 && selectedIndex === 2 && (
          <span className={styles.cursor}>▼</span>
        )}

        <UpdateButton />
      </div>
      <div
        className={`${styles.tutorialButton} ${
          selectedColumn === 2 && selectedIndex === 3 ? styles.selected : ""
        }`}
      >
        {selectedColumn === 2 && selectedIndex === 3 && (
          <span className={styles.cursor}>▼</span>
        )}

        <InstallButton />
      </div>
    </div>
  );
}
