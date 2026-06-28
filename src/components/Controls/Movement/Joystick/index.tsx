import { useEffect, useRef } from "react";
import type { GameControlLayer } from "@/utils/types/player/controls";

type Dir = Direction;

type Props = {
  activeControls: GameControlLayer;
  pressed: Set<string>;
};

export function JoystickMovement({ activeControls, pressed }: Props) {
  const activeDir = useRef<Set<Dir>>(new Set());

  const isDragging = useRef(false);

  const centerRef = useRef<HTMLDivElement | null>(null);

  const innerRef = useRef<HTMLDivElement | null>(null);

  const pressedRef = useRef(pressed);
  pressedRef.current = pressed;

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

  function syncInnerToKeyboard() {
    if (isDragging.current) return;
    const inner = innerRef.current;
    const el = centerRef.current;
    if (!inner || !el) return;

    const maxRadius = el.offsetWidth / 2 - inner.offsetWidth / 2;
    const p = pressedRef.current;

    let dx = 0;
    let dy = 0;
    if (p.has("left")) dx -= 1;
    if (p.has("right")) dx += 1;
    if (p.has("up")) dy -= 1;
    if (p.has("down")) dy += 1;

    if (dx === 0 && dy === 0) {
      inner.style.transform = "translate(0px, 0px)";
      return;
    }

    const len = Math.sqrt(dx * dx + dy * dy);
    const ratio = maxRadius / len;
    inner.style.transform = `translate(${dx * ratio}px, ${dy * ratio}px)`;
  }

  useEffect(() => {
    syncInnerToKeyboard();
  }, [pressed]);

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

    syncInnerToKeyboard();
  }

  return (
    <div
      ref={centerRef}
      className="dpad"
      onPointerDown={handleStart}
      onPointerMove={handleMove}
      onPointerUp={handleEnd}
      onPointerCancel={handleEnd}
    >
      <div ref={innerRef} className="inner" />
      <div className={`dpadArrow dpadArrowUp ${pressed.has("up") ? "dpadArrowActive" : ""}`} />
      <div className={`dpadArrow dpadArrowDown ${pressed.has("down") ? "dpadArrowActive" : ""}`} />
      <div className={`dpadArrow dpadArrowLeft ${pressed.has("left") ? "dpadArrowActive" : ""}`} />
      <div className={`dpadArrow dpadArrowRight ${pressed.has("right") ? "dpadArrowActive" : ""}`} />
    </div>
  );
}
