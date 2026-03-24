import { MoveUp, MoveDown, MoveLeft, MoveRight } from "lucide-react";
import styles from "./styles.module.css";


type Props = {
  onUp?: () => void;
  onDown?: () => void;
  onLeft?: () => void;
  onRight?: () => void;
};

export function Movement({ onUp, onDown, onLeft, onRight }: Props) {
  return (
    <div className={styles.movement}>
      <button className={styles.up} onClick={onUp}>
        <MoveUp size={16} />
      </button>

      <button className={styles.left} onClick={onLeft}>
        <MoveLeft size={16} />
      </button>

      <div className={styles.empty}></div>

      <button className={styles.right} onClick={onRight}>
        <MoveRight size={16} />
      </button>

      <button className={styles.down} onClick={onDown}>
        <MoveDown size={16} />
      </button>
    </div>
  );
}