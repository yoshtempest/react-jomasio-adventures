import {
  MoveUp,
  MoveDown,
  MoveLeft,
  MoveRight,
} from "lucide-react";

import styles from "./styles.module.css";

type Props = {
  activeControls: any;
};

export function ButtonsMovement({
  activeControls,
}: Props) {
  const press =
    (fn?: () => void) => () => fn?.();

  return (
    <div className={styles.movement}>
      <button
        className={styles.up}
        onMouseDown={press(
          activeControls?.onUp
        )}
        onMouseUp={press(
          activeControls?.onUpRelease
        )}
      >
        <MoveUp size={16} />
      </button>

      <button
        className={styles.left}
        onMouseDown={press(
          activeControls?.onLeft
        )}
        onMouseUp={press(
          activeControls?.onLeftRelease
        )}
      >
        <MoveLeft size={16} />
      </button>

      <div className={styles.empty}></div>

      <button
        className={styles.right}
        onMouseDown={press(
          activeControls?.onRight
        )}
        onMouseUp={press(
          activeControls?.onRightRelease
        )}
      >
        <MoveRight size={16} />
      </button>

      <button
        className={styles.down}
        onMouseDown={press(
          activeControls?.onDown
        )}
        onMouseUp={press(
          activeControls?.onDownRelease
        )}
      >
        <MoveDown size={16} />
      </button>
    </div>
  );
}