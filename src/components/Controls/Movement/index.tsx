import { useEffect, useRef, useState } from "react";
import { usePlayer } from "@/contexts/PlayerContext";
import { useNavbar } from "@/contexts/NavbarContext";
import { useGameControls } from "@/contexts/GameControlsContext";
import { isMovementLocked } from "@/gameRules/movement/state";
import { JoystickMovement } from "./Joystick";
import { ButtonsMovement } from "./Buttons";

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
    startMoveLeft,
    stopMoveLeft,
    startMoveRight,
    stopMoveRight,
    releaseDownBattle,
  } = usePlayer();

  const { isNavOpen } = useNavbar();

  const {
    activeControls,
    pushControls,
    popControls,
  } = useGameControls();

  const isLocked = isMovementLocked(
    player.mode,
    isNavOpen
  );

  const isBattle = player.mode === "battle";

  const [mode, setMode] = useState<
    "joystick" | "buttons"
  >("joystick");

  const isLockedRef = useRef(isLocked);
  const isBattleRef = useRef(isBattle);

  const moveUpRef = useRef(moveUp);
  const moveDownRef = useRef(moveDown);
  const moveLeftRef = useRef(moveLeft);
  const moveRightRef = useRef(moveRight);

  const moveUpBattleRef =
    useRef(moveUpBattle);

  const moveDownBattleRef =
    useRef(moveDownBattle);

  const startMoveLeftRef =
    useRef(startMoveLeft);

  const stopMoveLeftRef =
    useRef(stopMoveLeft);

  const startMoveRightRef =
    useRef(startMoveRight);

  const stopMoveRightRef =
    useRef(stopMoveRight);

  const releaseDownBattleRef = useRef(
    releaseDownBattle
  );

  useEffect(() => {
    isLockedRef.current = isLocked;

    isBattleRef.current = isBattle;

    moveUpRef.current = moveUp;
    moveDownRef.current = moveDown;
    moveLeftRef.current = moveLeft;
    moveRightRef.current = moveRight;

    moveUpBattleRef.current =
      moveUpBattle;

    moveDownBattleRef.current =
      moveDownBattle;

    startMoveLeftRef.current =
      startMoveLeft;

    stopMoveLeftRef.current =
      stopMoveLeft;

    startMoveRightRef.current =
      startMoveRight;

    stopMoveRightRef.current =
      stopMoveRight;

    releaseDownBattleRef.current =
      releaseDownBattle;
  });

  const pushControlsRef = useRef(pushControls);
  pushControlsRef.current = pushControls;
  const popControlsRef = useRef(popControls);
  popControlsRef.current = popControls;

  useEffect(() => {
    const controls = {
      onUp: () => {
        if (isLockedRef.current) return;

        if (isBattleRef.current) moveUpBattleRef.current();
        else moveUpRef.current();
      },

      onDown: () => {
        if (isLockedRef.current) return;

        if (isBattleRef.current) moveDownBattleRef.current();
        else moveDownRef.current();
      },

      onLeft: () => {
        if (isLockedRef.current) return;

        if (isBattleRef.current) startMoveLeftRef.current();
        else moveLeftRef.current();
      },

      onRight: () => {
        if (isLockedRef.current) return;

        if (isBattleRef.current) startMoveRightRef.current();
        else moveRightRef.current();
      },

      onLeftRelease: () => {
        if (isBattleRef.current)
          stopMoveLeftRef.current();
      },

      onRightRelease: () => {
        if (isBattleRef.current)
          stopMoveRightRef.current();
      },

      onDownRelease: () => {
        if (isBattleRef.current)
          releaseDownBattleRef.current();
      },
    };

    pushControlsRef.current(controls);

    return () => popControlsRef.current();
  }, []);

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
        {mode === "joystick"
          ? "◉"
          : "✚"}
      </button>

      {mode === "joystick" ? (
        <JoystickMovement
          activeControls={activeControls}
        />
      ) : (
        <ButtonsMovement
          activeControls={activeControls}
        />
      )}
    </>
  );
}