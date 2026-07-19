import { useCallback, useEffect, useRef, useState } from "react";
import { usePlayer } from "@/contexts/PlayerContext";
import { useNavbar } from "@/contexts/NavbarContext";
import { useGameControls } from "@/contexts/GameControlsContext";
import { isMovementLocked } from "@/gameRules/movement/state";
import { useCharacterProgress } from "@/contexts/CharacterProgressContext";
import { useDashDetection } from "./useDashDetection";

type Dir = "up" | "down" | "left" | "right";

export function useKeyboardMovement() {
  const {
    player,
    moveUp,
    moveDown,
    moveLeft,
    moveRight,
    moveUpBattle,
    toggleCrouch,
    startMoveLeft,
    stopMoveLeft,
    startMoveRight,
    stopMoveRight,
    startMoveUpExplore,
    stopMoveUpExplore,
    startMoveDownExplore,
    stopMoveDownExplore,
    startMoveLeftExplore,
    stopMoveLeftExplore,
    startMoveRightExplore,
    stopMoveRightExplore,
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
  const toggleCrouchRef = useRef(toggleCrouch);

  const startMoveLeftRef = useRef(startMoveLeft);
  const stopMoveLeftRef = useRef(stopMoveLeft);
  const startMoveRightRef = useRef(startMoveRight);
  const stopMoveRightRef = useRef(stopMoveRight);
  const startMoveUpExploreRef = useRef(startMoveUpExplore);
  const stopMoveUpExploreRef = useRef(stopMoveUpExplore);
  const startMoveDownExploreRef = useRef(startMoveDownExplore);
  const stopMoveDownExploreRef = useRef(stopMoveDownExplore);
  const startMoveLeftExploreRef = useRef(startMoveLeftExplore);
  const stopMoveLeftExploreRef = useRef(stopMoveLeftExplore);
  const startMoveRightExploreRef = useRef(startMoveRightExplore);
  const stopMoveRightExploreRef = useRef(stopMoveRightExplore);

  const { progress } = useCharacterProgress();
  const progressRef = useRef(progress);
  progressRef.current = progress;
  const playerRef = useRef(player);
  playerRef.current = player;

  const dashRef = useRef(dash);
  const lastLeftPressRef = useRef(0);
  const lastRightPressRef = useRef(0);
  const lastDashTimeRef = useRef(0);
  const isUpHeldRef = useRef(false);
  const isDownHeldRef = useRef(false);
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
    toggleCrouchRef.current = toggleCrouch;

    startMoveLeftRef.current = startMoveLeft;
    stopMoveLeftRef.current = stopMoveLeft;
    startMoveRightRef.current = startMoveRight;
    stopMoveRightRef.current = stopMoveRight;
    startMoveUpExploreRef.current = startMoveUpExplore;
    stopMoveUpExploreRef.current = stopMoveUpExplore;
    startMoveDownExploreRef.current = startMoveDownExplore;
    stopMoveDownExploreRef.current = stopMoveDownExplore;
    startMoveLeftExploreRef.current = startMoveLeftExplore;
    stopMoveLeftExploreRef.current = stopMoveLeftExplore;
    startMoveRightExploreRef.current = startMoveRightExplore;
    stopMoveRightExploreRef.current = stopMoveRightExplore;

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

  const dashRefs = {
    progressRef,
    playerRef,
    dashRef,
    lastLeftPressRef,
    lastRightPressRef,
    lastDashTimeRef,
  };
  const { tryDashRef } = useDashDetection(dashRefs);

  useEffect(() => {
    const DIR_KEYS: Record<string, Dir> = {
      ArrowUp: "up",
      w: "up",
      W: "up",
      ArrowDown: "down",
      s: "down",
      S: "down",
      ArrowLeft: "left",
      a: "left",
      A: "left",
      ArrowRight: "right",
      d: "right",
      D: "right",
    };

    function onKeyDown(e: KeyboardEvent) {
      const dir = DIR_KEYS[e.key];
      if (dir) pressRef.current(dir);
    }

    function onKeyUp(e: KeyboardEvent) {
      const dir = DIR_KEYS[e.key];
      if (dir) releaseRef.current(dir);
    }

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  const isGrabbed = () =>
    (playerRef.current.grabbedUntil != null &&
      Date.now() < (playerRef.current.grabbedUntil ?? 0)) ||
    playerRef.current.state === "fallen";

  useEffect(() => {
    const controls = {
      onUp: () => {
        if (isLockedRef.current) return;
        if (isGrabbed()) return;
        if (isUpHeldRef.current) {
          if (isBattleRef.current) moveUpBattleRef.current();
          else moveUpRef.current();
          return;
        }
        isUpHeldRef.current = true;
        if (isBattleRef.current) moveUpBattleRef.current();
        else {
          moveUpRef.current();
          startMoveUpExploreRef.current();
        }
      },
      onUpRelease: () => {
        isUpHeldRef.current = false;
        if (!isBattleRef.current) stopMoveUpExploreRef.current();
      },

      onDown: () => {
        if (isLockedRef.current) return;
        if (isGrabbed()) return;
        if (isDownHeldRef.current) {
          if (isBattleRef.current) toggleCrouchRef.current();
          else moveDownRef.current();
          return;
        }
        isDownHeldRef.current = true;
        if (isBattleRef.current) toggleCrouchRef.current();
        else {
          moveDownRef.current();
          startMoveDownExploreRef.current();
        }
      },
      onDownRelease: () => {
        isDownHeldRef.current = false;
        if (!isBattleRef.current) stopMoveDownExploreRef.current();
      },

      onLeft: () => {
        if (isLockedRef.current) return;
        if (isGrabbed()) return;
        if (isLeftHeldRef.current) {
          if (isBattleRef.current) startMoveLeftRef.current();
          else moveLeftRef.current();
          return;
        }
        isLeftHeldRef.current = true;
        if (isBattleRef.current) {
          tryDashRef.current("left", startMoveLeftRef);
        } else {
          moveLeftRef.current();
          startMoveLeftExploreRef.current();
        }
      },
      onLeftRelease: () => {
        isLeftHeldRef.current = false;
        if (isBattleRef.current) stopMoveLeftRef.current();
        else stopMoveLeftExploreRef.current();
      },

      onRight: () => {
        if (isLockedRef.current) return;
        if (isGrabbed()) return;
        if (isRightHeldRef.current) {
          if (isBattleRef.current) startMoveRightRef.current();
          else moveRightRef.current();
          return;
        }
        isRightHeldRef.current = true;
        if (isBattleRef.current) {
          tryDashRef.current("right", startMoveRightRef);
        } else {
          moveRightRef.current();
          startMoveRightExploreRef.current();
        }
      },
      onRightRelease: () => {
        isRightHeldRef.current = false;
        if (isBattleRef.current) stopMoveRightRef.current();
        else stopMoveRightExploreRef.current();
      },
    };

    pushControlsRef.current(controls);
    return () => popControlsRef.current();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    pressed,
    mode,
    setMode,
    activeControls,
    press,
    release,
  };
}
