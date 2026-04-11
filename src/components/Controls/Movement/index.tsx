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
  } = usePlayer();

  const isBattle = player.mode === "battle";

  const upHold = useHoldAction(moveUp, 300);
  const downHold = useHoldAction(moveDown, 300);
  const leftHold = useHoldAction(moveLeft, 300);
  const rightHold = useHoldAction(moveRight, 300);

  const up = isBattle
    ? { onClick: moveUpBattle }
    : upHold;

  const down = isBattle
    ? { onClick: moveDownBattle }
    : downHold;

  const left = isBattle
    ? { onClick: moveLeftBattle }
    : leftHold;

  const right = isBattle
    ? { onClick: moveRightBattle }
    : rightHold;
  const { openInventory } = usePlayer();

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (isBattle && e.repeat) return; // 👈 BLOQUEIA SEGURAR

      switch (e.key) {
        case "ArrowUp":
        case "w":
          isBattle ? moveUpBattle() : moveUp();
          break;

        case "ArrowDown":
        case "s":
          isBattle ? moveDownBattle() : moveDown();
          break;

        case "ArrowLeft":
        case "a":
          isBattle ? moveLeftBattle() : moveLeft();
          break;

        case "ArrowRight":
        case "d":
          isBattle ? moveRightBattle() : moveRight();
          break;

        case "b":
          openInventory();
          break;
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
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