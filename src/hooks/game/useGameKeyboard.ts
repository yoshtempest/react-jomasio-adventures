import { useEffect } from "react";
import type { RefObject } from "react";

import type { GameControlLayer } from "@/utils/types/player/controls";
import type { NavScreen } from "@/utils/types/player/navbar";
import {
  KEY_ACTIONS,
  KEY_RELEASE_ACTIONS,
  SCREEN_SHORTCUT_KEYS,
} from "@/data/keyActions";

type GameKeyboardOptions = {
  controlsRef: RefObject<GameControlLayer>;
  playerModeRef: RefObject<string>;
  isNavOpenRef: RefObject<boolean>;
  screenRef: RefObject<string | undefined>;

  openNavbar: () => void;
  closeAllMenus: () => void;

  closeNavbar: () => void;
  openScreen: (screen: Exclude<NavScreen, "menu">) => void;
};

export function useGameKeyboard({
  controlsRef,
  playerModeRef,
  isNavOpenRef,
  screenRef,

  openNavbar,
  closeAllMenus,

  closeNavbar,
  openScreen,
}: GameKeyboardOptions) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const controls = controlsRef.current;

      const action = KEY_ACTIONS[e.key];

      if (action) {
        controls[action]?.();
        return;
      }

      if (e.key === "Shift") {
        if (playerModeRef.current === "battle") {
          controls.onDown?.();
        }
        return;
      }

      if (e.key === "g" || e.key === "G" || e.key === "Tab") {
        if (controls.onOpen) {
          controls.onOpen();
          return;
        }

        if (controls.blockGlobalOpen && playerModeRef.current === "explore") {
          closeAllMenus();
          return;
        }

        if (!controls.blockGlobalOpen && playerModeRef.current === "explore") {
          openNavbar();
        }

        return;
      }

      const shortcutScreen = SCREEN_SHORTCUT_KEYS[e.key];

      if (shortcutScreen) {
        if (isNavOpenRef.current && screenRef.current === shortcutScreen) {
          closeNavbar();
        } else {
          openScreen(shortcutScreen);
        }
      }
    }

    function handleKeyUp(e: KeyboardEvent) {
      const controls = controlsRef.current;

      const action = KEY_RELEASE_ACTIONS[e.key];

      if (action) {
        controls[action]?.();
        return;
      }

      if (e.key === "Shift" && playerModeRef.current === "battle") {
        controls.onDownRelease?.();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [
    controlsRef,
    playerModeRef,
    isNavOpenRef,
    screenRef,

    openNavbar,
    closeAllMenus,
    closeNavbar,
    openScreen,
  ]);
}
