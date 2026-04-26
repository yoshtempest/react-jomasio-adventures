import { MoveUp, MoveDown, MoveLeft, MoveRight } from "lucide-react";
import { usePlayer } from "@/contexts/PlayerContext";
import { useEffect, useRef } from "react";
import styles from "./styles.module.css";
import { useNavbar } from "@/contexts/NavbarContext";
import { useGameControls } from "@/contexts/GameControlsContext";
import { isMovementLocked } from "@/gameRules/movement/state";

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
  );
}