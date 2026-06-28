import { useRef } from "react";
import { MoveUp, MoveDown, MoveLeft, MoveRight } from "lucide-react";

import styles from "./styles.module.css";
import type { GameControlLayer } from "@/utils/types/player/controls";

type Props = {
  activeControls: GameControlLayer;
  pressed: Set<string>;
  onPressDir?: (dir: Direction) => void;
  onReleaseDir?: (dir: Direction) => void;
};

export function ButtonsMovement({ activeControls, pressed, onPressDir, onReleaseDir }: Props) {
  const holdRef = useRef<NodeJS.Timeout | null>(null);
  const heldDir = useRef<Direction | null>(null);

  function startHold(dir: Direction, fn?: () => void) {
    onPressDir?.(dir);
    heldDir.current = dir;
    fn?.();
    holdRef.current = setInterval(() => {
      fn?.();
    }, 120);
  }

  function stopHold(dir: Direction, releaseFn?: () => void) {
    if (holdRef.current) {
      clearInterval(holdRef.current);
      holdRef.current = null;
    }
    onReleaseDir?.(dir);
    heldDir.current = null;
    releaseFn?.();
  }

  function pressOnce(dir: Direction, fn?: () => void) {
    onPressDir?.(dir);
    fn?.();
  }

  function releaseOnce(dir: Direction, releaseFn?: () => void) {
    onReleaseDir?.(dir);
    releaseFn?.();
  }

  function btnClass(dir: string) {
    return `${styles[dir as keyof typeof styles]} ${pressed.has(dir) ? styles.pressed : ""}`;
  }

  return (
    <div className={styles.movement}>
      <button
        className={btnClass("up")}
        onPointerDown={() => pressOnce("up", activeControls?.onUp)}
        onPointerUp={() => releaseOnce("up", activeControls?.onUpRelease)}
        onPointerLeave={() => releaseOnce("up", activeControls?.onUpRelease)}
      >
        <MoveUp size={22} />
      </button>

      <button
        className={btnClass("left")}
        onPointerDown={() => startHold("left", activeControls?.onLeft)}
        onPointerUp={() => stopHold("left", activeControls?.onLeftRelease)}
        onPointerLeave={() => stopHold("left", activeControls?.onLeftRelease)}
      >
        <MoveLeft size={22} />
      </button>

      <button
        className={btnClass("right")}
        onPointerDown={() => startHold("right", activeControls?.onRight)}
        onPointerUp={() => stopHold("right", activeControls?.onRightRelease)}
        onPointerLeave={() => stopHold("right", activeControls?.onRightRelease)}
      >
        <MoveRight size={22} />
      </button>

      <button
        className={btnClass("down")}
        onPointerDown={() => pressOnce("down", activeControls?.onDown)}
        onPointerUp={() => releaseOnce("down", activeControls?.onDownRelease)}
        onPointerLeave={() => releaseOnce("down", activeControls?.onDownRelease)}
      >
        <MoveDown size={22} />
      </button>
    </div>
  );
}
