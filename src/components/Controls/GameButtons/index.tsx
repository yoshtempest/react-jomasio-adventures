import styles from './styles.module.css';
import { useGameControls } from "../../../contexts/GameControlsContext";


export function GameButtons() {
  const { onConfirm, onCancel } = useGameControls();
  return (
    <div className={styles.gameButtons}>
      <button className={styles.button} onClick={onCancel}>
        B
      </button>

      <button className={styles.button} onClick={onConfirm}>
        A
      </button>
    </div>
  );
}