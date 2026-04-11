import { MoveUp, MoveDown, MoveLeft, MoveRight } from "lucide-react";
import { usePlayer } from "@/contexts/PlayerContext";
import { useEffect } from "react";
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
    releaseDownBattle, // 👈 NOVO
    openInventory,
  } = usePlayer();

  const isBattle = player.mode === "battle";

  // 🟢 hooks SEMPRE chamados
  const upHold = useHoldAction(moveUp, 300);
  const downHold = useHoldAction(moveDown, 300);
  const leftHold = useHoldAction(moveLeft, 300);
  const rightHold = useHoldAction(moveRight, 300);

  // 🎮 comportamento dinâmico
  const up = isBattle
    ? { onClick: moveUpBattle }
    : upHold;

  const down = isBattle
    ? {
        onMouseDown: moveDownBattle,
        onMouseUp: releaseDownBattle,
        onMouseLeave: releaseDownBattle,
      }
    : downHold;

  const left = isBattle
    ? { onClick: moveLeftBattle }
    : leftHold;

  const right = isBattle
    ? { onClick: moveRightBattle }
    : rightHold;

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
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
            if (e.repeat) return;
            moveLeftBattle();
          } else {
            moveLeft();
          }
          break;

        case "ArrowRight":
        case "d":
          if (isBattle) {
            if (e.repeat) return;
            moveRightBattle();
          } else {
            moveRight();
          }
          break;

        case "b":
          openInventory();
          break;
      }
    }

    function handleKeyUp(e: KeyboardEvent) {
      if (e.key === "ArrowDown" || e.key === "s") {
        if (isBattle) {
          releaseDownBattle(); // 👈 solta
        }
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
    moveLeftBattle,
    moveRightBattle,
    releaseDownBattle,
    openInventory,
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