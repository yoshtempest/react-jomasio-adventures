import styles from './styles.module.css';
import { useGameControls } from "@/contexts/GameControlsContext";


export function GameButtons() {
  const { activeControls } = useGameControls();

  return (
    <div className={styles.gameButtons}>
      <button className={styles.open} onClick={activeControls?.onOpen} />
      <div className={styles.row}>
        <button className={styles.button} onClick={activeControls?.onCancel}>
          B
        </button>

        <button className={styles.button} onClick={activeControls?.onConfirm}>
          A
        </button>
      </div>
    </div>
  );
}