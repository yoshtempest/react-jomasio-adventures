import styles from './styles.module.css';
import { useGameControls } from "@/contexts/GameControlsContext";


export function GameButtons() {
  const { onConfirm, onCancel, onOpen } = useGameControls();

  return (
    <div className={styles.gameButtons}>
      <button className={styles.open} onClick={onOpen} />
      <div className={styles.row}>
        <button className={styles.button} onClick={onCancel}>
          B
        </button>

        <button className={styles.button} onClick={onConfirm}>
          A
        </button>
      </div>
    </div>
  );
}