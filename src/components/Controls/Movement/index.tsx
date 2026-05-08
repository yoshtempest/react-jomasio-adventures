// import { MoveUp, MoveDown, MoveLeft, MoveRight } from "lucide-react";
// import { usePlayer } from "@/contexts/PlayerContext";
// import { useEffect, useRef } from "react";
// import styles from "./styles.module.css";
// import { useNavbar } from "@/contexts/NavbarContext";
// import { useGameControls } from "@/contexts/GameControlsContext";
// import { isMovementLocked } from "@/gameRules/movement/state";

// export function Movement() {
//   const {
//     player,
//     moveUp,
//     moveDown,
//     moveLeft,
//     moveRight,
//     moveUpBattle,
//     moveDownBattle,
//     startMoveLeft,
//     stopMoveLeft,
//     startMoveRight,
//     stopMoveRight,
//     releaseDownBattle,
//   } = usePlayer();

//   const { isNavOpen } = useNavbar();
//   const { activeControls, pushControls, popControls } = useGameControls();

//   const isLocked = isMovementLocked(player.mode, isNavOpen);
//   const isBattle = player.mode === "battle";

//   const isLockedRef = useRef(isLocked);
//   const isBattleRef = useRef(isBattle);

//   const moveUpRef = useRef(moveUp);
//   const moveDownRef = useRef(moveDown);
//   const moveLeftRef = useRef(moveLeft);
//   const moveRightRef = useRef(moveRight);

//   const moveUpBattleRef = useRef(moveUpBattle);
//   const moveDownBattleRef = useRef(moveDownBattle);

//   const startMoveLeftRef = useRef(startMoveLeft);
//   const stopMoveLeftRef = useRef(stopMoveLeft);
//   const startMoveRightRef = useRef(startMoveRight);
//   const stopMoveRightRef = useRef(stopMoveRight);

//   const releaseDownBattleRef = useRef(releaseDownBattle);

//   useEffect(() => {
//     isLockedRef.current = isLocked;
//     isBattleRef.current = isBattle;

//     moveUpRef.current = moveUp;
//     moveDownRef.current = moveDown;
//     moveLeftRef.current = moveLeft;
//     moveRightRef.current = moveRight;

//     moveUpBattleRef.current = moveUpBattle;
//     moveDownBattleRef.current = moveDownBattle;

//     startMoveLeftRef.current = startMoveLeft;
//     stopMoveLeftRef.current = stopMoveLeft;
//     startMoveRightRef.current = startMoveRight;
//     stopMoveRightRef.current = stopMoveRight;

//     releaseDownBattleRef.current = releaseDownBattle;
//   });

//   // 🔥 registra controls do player
//   useEffect(() => {
//     const controls = {
//       onUp: () => {
//         if (isLockedRef.current) return;
//         isBattleRef.current
//           ? moveUpBattleRef.current()
//           : moveUpRef.current();
//       },

//       onDown: () => {
//         if (isLockedRef.current) return;
//         isBattleRef.current
//           ? moveDownBattleRef.current()
//           : moveDownRef.current();
//       },

//       onLeft: () => {
//         if (isLockedRef.current) return;
//         isBattleRef.current
//           ? startMoveLeftRef.current()
//           : moveLeftRef.current();
//       },

//       onRight: () => {
//         if (isLockedRef.current) return;
//         isBattleRef.current
//           ? startMoveRightRef.current()
//           : moveRightRef.current();
//       },

//       onLeftRelease: () => {
//         if (isBattleRef.current) stopMoveLeftRef.current();
//       },

//       onRightRelease: () => {
//         if (isBattleRef.current) stopMoveRightRef.current();
//       },

//       onDownRelease: () => {
//         if (isBattleRef.current) releaseDownBattleRef.current();
//       },
//     };

//     pushControls(controls);
//     return () => popControls();
//   }, []);

//   // 🔥 wrapper seguro (resolve stale state)
//   const press = (fn?: () => void) => () => fn?.();

//   return (
//     <div className={styles.movement}>
//       <button
//         className={styles.up}
//         onMouseDown={press(activeControls?.onUp)}
//         onMouseUp={press(activeControls?.onUpRelease)}
//       >
//         <MoveUp size={16} />
//       </button>

//       <button
//         className={styles.left}
//         onMouseDown={press(activeControls?.onLeft)}
//         onMouseUp={press(activeControls?.onLeftRelease)}
//       >
//         <MoveLeft size={16} />
//       </button>

//       <div className={styles.empty}></div>

//       <button
//         className={styles.right}
//         onMouseDown={press(activeControls?.onRight)}
//         onMouseUp={press(activeControls?.onRightRelease)}
//       >
//         <MoveRight size={16} />
//       </button>

//       <button
//         className={styles.down}
//         onMouseDown={press(activeControls?.onDown)}
//         onMouseUp={press(activeControls?.onDownRelease)}
//       >
//         <MoveDown size={16} />
//       </button>
//     </div>
//   );
// }

import { useRef, useEffect } from "react";
import { usePlayer } from "@/contexts/PlayerContext";
import { isMovementLocked } from "@/gameRules/movement/state";
import { useNavbar } from "@/contexts/NavbarContext";
import styles from "./styles.module.css";

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

  const isLocked = isMovementLocked(player.mode, isNavOpen);
  const isBattle = player.mode === "battle";

  const activeDir = useRef<Set<Dir>>(new Set());
  const isDragging = useRef(false);
  const centerRef = useRef<HTMLDivElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);
  const keys = useRef<Set<string>>(new Set());
  const inputMode = useRef<"keyboard" | "touch" | null>(null);

  function updateInnerFromDirection() {
    const inner = innerRef.current;
    const el = centerRef.current;
    if (!inner || !el) return;

    const rect = el.getBoundingClientRect();
    const maxRadius = rect.width / 2;

    let x = 0;
    let y = 0;

    if (activeDir.current.has("left")) x -= maxRadius;
    if (activeDir.current.has("right")) x += maxRadius;
    if (activeDir.current.has("up")) y -= maxRadius;
    if (activeDir.current.has("down")) y += maxRadius;

    inner.style.transform = `translate(${x}px, ${y}px)`;
  }

  function trigger(dir: Dir, pressed: boolean, source?: "keyboard" | "touch") {
    if (isLocked) return;

    if (!inputMode.current && source) {
      inputMode.current = source;
    }

    // bloqueia outro input
    if (inputMode.current && source && inputMode.current !== source) {
      return;
    }

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

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (isLocked) return;

      const key = e.key.toLowerCase();

      if (keys.current.has(key)) return;
      keys.current.add(key);

      const source = "keyboard";

      switch (key) {
        case "w":
          activeDir.current.add("up");
          trigger("up", true, source);
          break;
        case "s":
          activeDir.current.add("down");
          trigger("down", true, source);
          break;
        case "a":
          activeDir.current.add("left");
          trigger("left", true, source);
          break;
        case "d":
          activeDir.current.add("right");
          trigger("right", true, source);
          break;
      }
      inputMode.current = "keyboard";
      updateInnerFromDirection();
    }

    function onKeyUp(e: KeyboardEvent) {
      const key = e.key.toLowerCase();
      keys.current.delete(key);

      const source = "keyboard";

      switch (key) {
        case "w":
          activeDir.current.delete("up");
          trigger("up", false, source);
          break;
        case "s":
          activeDir.current.delete("down");
          trigger("down", false, source);
          break;
        case "a":
          activeDir.current.delete("left");
          trigger("left", false, source);
          break;
        case "d":
          activeDir.current.delete("right");
          trigger("right", false, source);
          break;
      }
      if (keys.current.size === 0) {
        inputMode.current = null;
      }
      updateInnerFromDirection();
    }

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [isLocked]);

  function updateDirection(clientX: number, clientY: number) {
    const el = centerRef.current;
    const inner = innerRef.current;
    if (!el || !inner) return;

    const rect = el.getBoundingClientRect();

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    let x = clientX - centerX;
    let y = clientY - centerY;

    // raio máximo (metade do dpad)
    const maxRadius = rect.width / 2;

    // normaliza dentro do círculo
    const distance = Math.sqrt(x * x + y * y);

    if (distance > maxRadius) {
      const ratio = maxRadius / distance;
      x *= ratio;
      y *= ratio;
    }

    // 🔥 MOVE O INNER
    inner.style.transform = `translate(${x}px, ${y}px)`;

    const deadzone = 15;

    const newDir = new Set<Dir>();

    if (y < -deadzone) newDir.add("up");
    else if (y > deadzone) newDir.add("down");

    if (x < -deadzone) newDir.add("left");
    else if (x > deadzone) newDir.add("right");

    activeDir.current.forEach((dir) => {
      if (!newDir.has(dir)) trigger(dir, false, "touch");
    });

    newDir.forEach((dir) => {
      if (!activeDir.current.has(dir)) trigger(dir, true, "touch");
    });

    activeDir.current = new Set(newDir);
    updateInnerFromDirection();
  }

  function handleStart(e: React.PointerEvent) {
    inputMode.current = "touch";
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

    activeDir.current.forEach((dir) => trigger(dir, false));
    activeDir.current.clear();
    inputMode.current = null;
    if (innerRef.current) {
      innerRef.current.style.transform = "translate(0px, 0px)";
    }
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