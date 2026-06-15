import { useRef } from "react";
import styles from "./styles.module.css";
import type { GameControlLayer } from "@/utils/types/player/controls";

type Dir = Direction;

type Props = {
  activeControls: GameControlLayer;
};

export function JoystickMovement({ activeControls }: Props) {
  const activeDir = useRef<Set<Dir>>(new Set());

  const isDragging = useRef(false);

  const centerRef = useRef<HTMLDivElement | null>(null);

  const innerRef = useRef<HTMLDivElement | null>(null);

  function execute(dir: Dir, pressed: boolean) {
    switch (dir) {
      case "up":
        if (pressed) activeControls?.onUp?.();
        break;

      case "down":
        if (pressed) activeControls?.onDown?.();
        else activeControls?.onDownRelease?.();
        break;

      case "left":
        if (pressed) activeControls?.onLeft?.();
        else activeControls?.onLeftRelease?.();
        break;

      case "right":
        if (pressed) activeControls?.onRight?.();
        else activeControls?.onRightRelease?.();
        break;
    }
  }

  function resetInner() {
    if (!innerRef.current) return;

    innerRef.current.style.transform = "translate(0px, 0px)";
  }

  function updateDirection(clientX: number, clientY: number) {
    const el = centerRef.current;
    const inner = innerRef.current;

    if (!el || !inner) return;

    const rect = el.getBoundingClientRect();

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    let x = clientX - centerX;
    let y = clientY - centerY;

    const maxRadius = rect.width / 2 - inner.offsetWidth / 2;

    const distance = Math.sqrt(x * x + y * y);

    if (distance > maxRadius) {
      const ratio = maxRadius / distance;

      x *= ratio;
      y *= ratio;
    }

    inner.style.transform = `translate(${x}px, ${y}px)`;

    const deadzone = 15;

    const newDir = new Set<Dir>();

    if (y < -deadzone) newDir.add("up");
    else if (y > deadzone) newDir.add("down");

    if (x < -deadzone) newDir.add("left");
    else if (x > deadzone) newDir.add("right");

    activeDir.current.forEach((dir) => {
      if (!newDir.has(dir)) {
        execute(dir, false);
      }
    });

    newDir.forEach((dir) => {
      if (!activeDir.current.has(dir)) {
        execute(dir, true);
      }
    });

    activeDir.current = new Set(newDir);
  }

  function handleStart(e: React.PointerEvent) {
    isDragging.current = true;

    const el = e.currentTarget as HTMLElement;

    el.setPointerCapture(e.pointerId);

    updateDirection(e.clientX, e.clientY);
  }

  function handleMove(e: React.PointerEvent) {
    if (!isDragging.current) return;

    updateDirection(e.clientX, e.clientY);
  }

  function handleEnd() {
    isDragging.current = false;

    activeDir.current.forEach((dir) => {
      execute(dir, false);
    });

    activeDir.current.clear();

    resetInner();
  }

  return (
    <div
      ref={centerRef}
      className={styles.dpad}
      onPointerDown={handleStart}
      onPointerMove={handleMove}
      onPointerUp={handleEnd}
      onPointerCancel={handleEnd}
    >
      <div ref={innerRef} className={styles.inner} />
    </div>
  );
}
