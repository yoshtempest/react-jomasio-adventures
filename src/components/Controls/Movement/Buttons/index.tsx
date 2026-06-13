import { useRef } from "react";
import {
  MoveUp,
  MoveDown,
  MoveLeft,
  MoveRight,
} from "lucide-react";

import styles from "./styles.module.css";
import type { GameControlLayer } from "@/utils/types/player/controls";

type Props = {
  activeControls: GameControlLayer;
  pressed: Set<string>;
};

export function ButtonsMovement({
  activeControls,
  pressed,
}: Props) {
  const holdRef = useRef<NodeJS.Timeout | null>(null);

  function startHold(fn?: () => void) {
    fn?.();
    holdRef.current = setInterval(() => {
      fn?.();
    }, 120);
  }

  function stopHold(releaseFn?: () => void) {
    if (holdRef.current) {
      clearInterval(holdRef.current);
      holdRef.current = null;
    }
    releaseFn?.();
  }

  function btnClass(dir: string) {
    return `${styles[dir as keyof typeof styles]} ${pressed.has(dir) ? styles.pressed : ""}`;
  }

  return (
    <div className={styles.movement}>
      <button
        className={btnClass("up")}
        onPointerDown={() => activeControls?.onUp?.()}
        onPointerUp={() => activeControls?.onUpRelease?.()}
        onPointerLeave={() => activeControls?.onUpRelease?.()}
      >
        <MoveUp size={22} />
      </button>

      <button
        className={btnClass("left")}
        onPointerDown={() => startHold(activeControls?.onLeft)}
        onPointerUp={() => stopHold(activeControls?.onLeftRelease)}
        onPointerLeave={() => stopHold(activeControls?.onLeftRelease)}
      >
        <MoveLeft size={22} />
      </button>

      <button
        className={btnClass("right")}
        onPointerDown={() => startHold(activeControls?.onRight)}
        onPointerUp={() => stopHold(activeControls?.onRightRelease)}
        onPointerLeave={() => stopHold(activeControls?.onRightRelease)}
      >
        <MoveRight size={22} />
      </button>

      <button
        className={btnClass("down")}
        onPointerDown={() => activeControls?.onDown?.()}
        onPointerUp={() => activeControls?.onDownRelease?.()}
        onPointerLeave={() => activeControls?.onDownRelease?.()}
      >
        <MoveDown size={22} />
      </button>
    </div>
  );
}
