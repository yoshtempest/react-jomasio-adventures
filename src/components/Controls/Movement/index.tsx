import { MoveUp, MoveDown, MoveLeft, MoveRight } from "lucide-react";
import { usePlayer } from "@/contexts/PlayerContext";
import styles from "./styles.module.css";

export function Movement() {
  const {
    player,
    moveUp,
    moveDown,
    moveLeft,
    moveRight,

    moveUpBattle,
    moveDownBattle,
    moveLeftBattle,
    moveRightBattle,
  } = usePlayer();

  const isBattle = player.mode === "battle";

  return (
    <div className={styles.movement}>
      <button
        className={styles.up}
        onClick={isBattle ? moveUpBattle : moveUp}
      >
        <MoveUp size={16} />
      </button>

      <button
        className={styles.left}
        onClick={isBattle ? moveLeftBattle : moveLeft}
      >
        <MoveLeft size={16} />
      </button>

      <div className={styles.empty}></div>

      <button
        className={styles.right}
        onClick={isBattle ? moveRightBattle : moveRight}
      >
        <MoveRight size={16} />
      </button>

      <button
        className={styles.down}
        onClick={isBattle ? moveDownBattle : moveDown}
      >
        <MoveDown size={16} />
      </button>
    </div>
  );
}