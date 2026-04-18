import { MoveUp, MoveDown, MoveLeft, MoveRight } from "lucide-react";
import { usePlayer } from "@/contexts/PlayerContext";
import { useEffect } from "react";
import { useHoldAction } from "@/hooks/useHoldAction";
import styles from "./styles.module.css";
import { useNavbar } from "@/contexts/NavbarContext";

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
    releaseDownBattle, // 👈 NOVO
  } = usePlayer();

  const { isNavOpen } = useNavbar();
  const isLocked = player.mode === "select" || isNavOpen;

  const isBattle = player.mode === "battle";

  // 🟢 hooks SEMPRE chamados
  const upHold = useHoldAction(moveUp, 300);
  const downHold = useHoldAction(moveDown, 300);
  const leftHold = useHoldAction(moveLeft, 300);
  const rightHold = useHoldAction(moveRight, 300);

  // 🎮 comportamento dinâmico
  const up = isLocked
    ? {}
    : isBattle
    ? { onClick: moveUpBattle }
    : upHold;

  const down = isLocked
    ? {}
    : isBattle
    ? {
        onMouseDown: moveDownBattle,
        onMouseUp: releaseDownBattle,
        onMouseLeave: releaseDownBattle,
      }
    : downHold;

  const left = isLocked
    ? {}
    : isBattle
    ? {
        onMouseDown: startMoveLeft,
        onMouseUp: stopMoveLeft,
        onMouseLeave: stopMoveLeft,
      }
    : leftHold;

  const right = isLocked
    ? {}
    : isBattle
    ? {
        onMouseDown: startMoveRight,
        onMouseUp: stopMoveRight,
        onMouseLeave: stopMoveRight,
      }
    : rightHold;

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (isLocked) return; // 🚨 trava tudo
      switch (e.key) {
        case "ArrowUp":
        case "w":
          if (isBattle) {
            if (e.repeat) return;
            moveUpBattle();
          } else {
            moveUp();
          }
          break;

        case "ArrowDown":
        case "s":
          if (isBattle) {
            moveDownBattle(); // 👈 segura
          } else {
            moveDown();
          }
          break;

        case "ArrowLeft":
        case "a":
          if (isBattle) {
            startMoveLeft();
          } else {
            moveLeft();
          }
          break;

        case "ArrowRight":
        case "d":
          if (isBattle) {
            startMoveRight();
          } else {
            moveRight();
          }
          break;
      }
    }

    function handleKeyUp(e: KeyboardEvent) {
      if (isLocked) return; // 🚨 trava tudo
      if (!isBattle) return;

      switch (e.key) {
        case "ArrowDown":
        case "s":
          releaseDownBattle();
          break;

        case "ArrowLeft":
        case "a":
          stopMoveLeft();
          break;

        case "ArrowRight":
        case "d":
          stopMoveRight();
          break;
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [
    isBattle,
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
  ]);

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