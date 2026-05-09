import { MoveUp, MoveDown, MoveLeft, MoveRight } from "lucide-react";
import { usePlayer } from "@/contexts/PlayerContext";
import { useEffect, useRef, useState } from "react";
import styles from "./styles.module.css";
import { useNavbar } from "@/contexts/NavbarContext";
import { useGameControls } from "@/contexts/GameControlsContext";
import { isMovementLocked } from "@/gameRules/movement/state";

type Dir = "up" | "down" | "left" | "right";

export function Movement() {
  const {
    player,
    moveUp,
    moveDown,
    moveLeft,
    moveRight,
    moveUpBattle,
    moveDownBattle,
    startMoveLeft,
    stopMoveLeft,
    startMoveRight,
    stopMoveRight,
    releaseDownBattle,
  } = usePlayer();

  const { isNavOpen } = useNavbar();
  const { activeControls, pushControls, popControls } = useGameControls();

  const isLocked = isMovementLocked(player.mode, isNavOpen);
  const isBattle = player.mode === "battle";
  const [mode, setMode] =
    useState<"joystick" | "buttons">("joystick");

  const isLockedRef = useRef(isLocked);
  const isBattleRef = useRef(isBattle);

  const moveUpRef = useRef(moveUp);
  const moveDownRef = useRef(moveDown);
  const moveLeftRef = useRef(moveLeft);
  const moveRightRef = useRef(moveRight);

  const moveUpBattleRef = useRef(moveUpBattle);
  const moveDownBattleRef = useRef(moveDownBattle);

  const startMoveLeftRef = useRef(startMoveLeft);
  const stopMoveLeftRef = useRef(stopMoveLeft);
  const startMoveRightRef = useRef(startMoveRight);
  const stopMoveRightRef = useRef(stopMoveRight);

  const releaseDownBattleRef = useRef(releaseDownBattle);

  const activeDir = useRef<Set<Dir>>(new Set());

  const isDragging = useRef(false);

  const centerRef = useRef<HTMLDivElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);

  function trigger(dir: Dir, pressed: boolean) {
    if (isLocked) return;

    switch (dir) {
      case "up":
        pressed
          ? (isBattle ? moveUpBattle() : moveUp())
          : undefined;
        break;

      case "down":
        pressed
          ? (isBattle ? moveDownBattle() : moveDown())
          : releaseDownBattle();
        break;

      case "left":
        pressed
          ? (isBattle ? startMoveLeft() : moveLeft())
          : stopMoveLeft();
        break;

      case "right":
        pressed
          ? (isBattle ? startMoveRight() : moveRight())
          : stopMoveRight();
        break;
    }
  }

  function resetInner() {
    if (!innerRef.current) return;

    innerRef.current.style.transform =
      "translate(0px, 0px)";
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

    const maxRadius =
      rect.width / 2 - inner.offsetWidth / 2;

    const distance = Math.sqrt(x * x + y * y);

    if (distance > maxRadius) {
      const ratio = maxRadius / distance;

      x *= ratio;
      y *= ratio;
    }

    inner.style.transform =
      `translate(${x}px, ${y}px)`;

    const deadzone = 15;

    const newDir = new Set<Dir>();

    if (y < -deadzone) newDir.add("up");
    else if (y > deadzone) newDir.add("down");

    if (x < -deadzone) newDir.add("left");
    else if (x > deadzone) newDir.add("right");

    activeDir.current.forEach((dir) => {
      if (!newDir.has(dir)) {
        trigger(dir, false);
      }
    });

    newDir.forEach((dir) => {
      if (!activeDir.current.has(dir)) {
        trigger(dir, true);
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
      trigger(dir, false);
    });

    activeDir.current.clear();

    resetInner();
  }

  useEffect(() => {
    isLockedRef.current = isLocked;
    isBattleRef.current = isBattle;

    moveUpRef.current = moveUp;
    moveDownRef.current = moveDown;
    moveLeftRef.current = moveLeft;
    moveRightRef.current = moveRight;

    moveUpBattleRef.current = moveUpBattle;
    moveDownBattleRef.current = moveDownBattle;

    startMoveLeftRef.current = startMoveLeft;
    stopMoveLeftRef.current = stopMoveLeft;
    startMoveRightRef.current = startMoveRight;
    stopMoveRightRef.current = stopMoveRight;

    releaseDownBattleRef.current = releaseDownBattle;
  });

  // 🔥 registra controls do player
  useEffect(() => {
    const controls = {
      onUp: () => {
        if (isLockedRef.current) return;
        isBattleRef.current
          ? moveUpBattleRef.current()
          : moveUpRef.current();
      },

      onDown: () => {
        if (isLockedRef.current) return;
        isBattleRef.current
          ? moveDownBattleRef.current()
          : moveDownRef.current();
      },

      onLeft: () => {
        if (isLockedRef.current) return;
        isBattleRef.current
          ? startMoveLeftRef.current()
          : moveLeftRef.current();
      },

      onRight: () => {
        if (isLockedRef.current) return;
        isBattleRef.current
          ? startMoveRightRef.current()
          : moveRightRef.current();
      },

      onLeftRelease: () => {
        if (isBattleRef.current) stopMoveLeftRef.current();
      },

      onRightRelease: () => {
        if (isBattleRef.current) stopMoveRightRef.current();
      },

      onDownRelease: () => {
        if (isBattleRef.current) releaseDownBattleRef.current();
      },
    };

    pushControls(controls);
    return () => popControls();
  }, []);

  // 🔥 wrapper seguro (resolve stale state)
  const press = (fn?: () => void) => () => fn?.();

  return (
    <>
      <button
        className={styles.toggle}
        onClick={() =>
          setMode((prev) =>
            prev === "joystick"
              ? "buttons"
              : "joystick"
          )
        }
      >
        {mode === "joystick" ? "◉" : "✚"}
      </button>
    {mode === "joystick" ? (
      <div
        ref={centerRef}
        className={styles.dpad}
        onPointerDown={handleStart}
        onPointerMove={handleMove}
        onPointerUp={handleEnd}
        onPointerCancel={handleEnd}
      >
        <div
          ref={innerRef}
          className={styles.inner}
        />
      </div>
      ) : (
        <div className={styles.movement}>
          <button
            className={styles.up}
            onMouseDown={press(activeControls?.onUp)}
            onMouseUp={press(activeControls?.onUpRelease)}
          >
            <MoveUp size={16} />
          </button>

          <button
            className={styles.left}
            onMouseDown={press(activeControls?.onLeft)}
            onMouseUp={press(activeControls?.onLeftRelease)}
          >
            <MoveLeft size={16} />
          </button>

          <div className={styles.empty}></div>

          <button
            className={styles.right}
            onMouseDown={press(activeControls?.onRight)}
            onMouseUp={press(activeControls?.onRightRelease)}
          >
            <MoveRight size={16} />
          </button>

          <button
            className={styles.down}
            onMouseDown={press(activeControls?.onDown)}
            onMouseUp={press(activeControls?.onDownRelease)}
          >
            <MoveDown size={16} />
          </button>
        </div>
      )}
    </>
  );
}