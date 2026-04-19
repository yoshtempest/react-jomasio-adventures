import styles from './styles.module.css';
import { useGameControls } from "@/contexts/GameControlsContext";
import { useNavbar } from "@/contexts/NavbarContext";
import { usePlayer } from "@/contexts/PlayerContext";

export function GameButtons() {
  const { activeControls } = useGameControls();
  const { openNavbar } = useNavbar();
  const { player } = usePlayer();

  function handleOpen() {
    if (activeControls?.onOpen) {
      activeControls.onOpen();
      return;
    }

    if (!activeControls?.blockGlobalOpen && player.mode === "explore") {
      openNavbar();
    }
  }

  return (
    <div className={styles.gameButtons}>
      <button className={styles.open} onClick={handleOpen} />
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