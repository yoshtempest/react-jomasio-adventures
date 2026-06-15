import { useCallback, useEffect, useRef, useState } from "react";
import { usePlayer } from "@/contexts/PlayerContext";
import { useNavbar } from "@/contexts/NavbarContext";
import { useGameControls } from "@/contexts/GameControlsContext";
import { isMovementLocked } from "@/gameRules/movement/state";
import { JoystickMovement } from "./Joystick";
import { ButtonsMovement } from "./Buttons";

import styles from "./styles.module.css";

type Dir = "up" | "down" | "left" | "right";

const DASH_THRESHOLD = 300;
const DASH_COOLDOWN = 600;

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
    dash,
  } = usePlayer();

  const { isNavOpen } = useNavbar();

  const { activeControls, pushControls, popControls } = useGameControls();

  const isLocked = isMovementLocked(player.mode, isNavOpen);

  const isBattle = player.mode === "battle";

  const [mode, setMode] = useState<"joystick" | "buttons">("joystick");

  const [pressed, setPressed] = useState<Set<Dir>>(new Set());

  const press = useCallback((dir: Dir) => {
    setPressed((prev) => {
      if (prev.has(dir)) return prev;
      return new Set(prev).add(dir);
    });
  }, []);

  const release = useCallback((dir: Dir) => {
    setPressed((prev) => {
      if (!prev.has(dir)) return prev;
      const next = new Set(prev);
      next.delete(dir);
      return next;
    });
  }, []);

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

  const dashRef = useRef(dash);
  const lastLeftPressRef = useRef(0);
  const lastRightPressRef = useRef(0);
  const lastDashTimeRef = useRef(0);
  const isLeftHeldRef = useRef(false);
  const isRightHeldRef = useRef(false);

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

    dashRef.current = dash;
  });

  const pushControlsRef = useRef(pushControls);
  pushControlsRef.current = pushControls;
  const popControlsRef = useRef(popControls);
  popControlsRef.current = popControls;

  const pressRef = useRef(press);
  pressRef.current = press;
  const releaseRef = useRef(release);
  releaseRef.current = release;

  useEffect(() => {
    const controls = {
      onUp: () => {
        if (isLockedRef.current) return;
        pressRef.current("up");
        if (isBattleRef.current) moveUpBattleRef.current();
        else moveUpRef.current();
      },
      onUpRelease: () => {
        releaseRef.current("up");
      },

      onDown: () => {
        if (isLockedRef.current) return;
        pressRef.current("down");
        if (isBattleRef.current) moveDownBattleRef.current();
        else moveDownRef.current();
      },
      onDownRelease: () => {
        releaseRef.current("down");
        if (isBattleRef.current) releaseDownBattleRef.current();
      },

      onLeft: () => {
        if (isLockedRef.current) return;
        if (isLeftHeldRef.current) {
          if (isBattleRef.current) startMoveLeftRef.current();
          else moveLeftRef.current();
          return;
        }
        isLeftHeldRef.current = true;
        pressRef.current("left");
        const now = Date.now();
        if (isBattleRef.current) {
          if (
            now - lastLeftPressRef.current < DASH_THRESHOLD &&
            now - lastDashTimeRef.current > DASH_COOLDOWN
          ) {
            dashRef.current("left");
            lastDashTimeRef.current = now;
            lastLeftPressRef.current = 0;
          } else {
            startMoveLeftRef.current();
            lastLeftPressRef.current = now;
          }
        } else {
          moveLeftRef.current();
        }
      },
      onLeftRelease: () => {
        isLeftHeldRef.current = false;
        releaseRef.current("left");
        if (isBattleRef.current) stopMoveLeftRef.current();
      },

      onRight: () => {
        if (isLockedRef.current) return;
        if (isRightHeldRef.current) {
          if (isBattleRef.current) startMoveRightRef.current();
          else moveRightRef.current();
          return;
        }
        isRightHeldRef.current = true;
        pressRef.current("right");
        const now = Date.now();
        if (isBattleRef.current) {
          if (
            now - lastRightPressRef.current < DASH_THRESHOLD &&
            now - lastDashTimeRef.current > DASH_COOLDOWN
          ) {
            dashRef.current("right");
            lastDashTimeRef.current = now;
            lastRightPressRef.current = 0;
          } else {
            startMoveRightRef.current();
            lastRightPressRef.current = now;
          }
        } else {
          moveRightRef.current();
        }
      },
      onRightRelease: () => {
        isRightHeldRef.current = false;
        releaseRef.current("right");
        if (isBattleRef.current) stopMoveRightRef.current();
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
          setMode((prev) => (prev === "joystick" ? "buttons" : "joystick"))
        }
      >
        {mode === "joystick" ? "◉" : "✚"}
      </button>

      {mode === "joystick" ? (
        <JoystickMovement activeControls={activeControls} />
      ) : (
        <ButtonsMovement activeControls={activeControls} pressed={pressed} />
      )}
    </>
  );
}
