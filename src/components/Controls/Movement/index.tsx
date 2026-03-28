import { MoveUp, MoveDown, MoveLeft, MoveRight } from "lucide-react";
import { usePlayer } from "@/contexts/PlayerContext";
import { useHoldAction } from "@/hooks/useHoldAction";
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

  const up = useHoldAction(isBattle ? moveUpBattle : moveUp, 200);
  const down = useHoldAction(isBattle ? moveDownBattle : moveDown, 200);
  const left = useHoldAction(isBattle ? moveLeftBattle : moveLeft, 200);
  const right = useHoldAction(isBattle ? moveRightBattle : moveRight, 200);

  return (
    <div className={styles.movement}>
      <button className={styles.up} {...up}>
        <MoveUp size={16} />
      </button>

      <button className={styles.left} {...left}>
        <MoveLeft size={16} />
      </button>

      <div className={styles.empty}></div>

      <button className={styles.right} {...right}>
        <MoveRight size={16} />
      </button>

      <button className={styles.down} {...down}>
        <MoveDown size={16} />
      </button>
    </div>
  );
}