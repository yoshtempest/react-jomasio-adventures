import { MoveUp, MoveDown, MoveLeft, MoveRight } from "lucide-react";
import { usePlayer } from "@/contexts/PlayerContext";
import styles from "./styles.module.css";

export function Movement() {
    const { moveUp, moveDown, moveLeft, moveRight } = usePlayer();
  return (
    <div className={styles.movement}>
      <button className={styles.up} onClick={moveUp}>
        <MoveUp size={16} />
      </button>

      <button className={styles.left} onClick={moveLeft}>
        <MoveLeft size={16} />
      </button>

      <div className={styles.empty}></div>

      <button className={styles.right} onClick={moveRight}>
        <MoveRight size={16} />
      </button>

      <button className={styles.down} onClick={moveDown}>
        <MoveDown size={16} />
      </button>
    </div>
  );
}