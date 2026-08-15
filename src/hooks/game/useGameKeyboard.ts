import { useEffect } from "react";
import type { RefObject } from "react";

import type { GameControlLayer } from "@/utils/types/player/controls";
import {
  KEY_ACTIONS,
  KEY_RELEASE_ACTIONS,
} from "@/data/keyActions";

type ScreenShortcut = {
  screen: string;
  open: () => void;
};

type GameKeyboardOptions = {
  controlsRef: RefObject<GameControlLayer>;
  playerModeRef: RefObject<string>;
  isNavOpenRef: RefObject<boolean>;
  screenRef: RefObject<string | undefined>;

  openNavbar: () => void;
  closeAllMenus: () => void;

  closeNavbar: () => void;
  openConfigScreen: () => void;
  openInventoryScreen: () => void;
  openQuestsScreen: () => void;
  openProfessionsScreen: () => void;
  openTitlesScreen: () => void;
  openEquipmentScreen: () => void;
};

export function useGameKeyboard({
  controlsRef,
  playerModeRef,
  isNavOpenRef,
  screenRef,

  openNavbar,
  closeAllMenus,

  closeNavbar,
  openConfigScreen,
  openInventoryScreen,
  openQuestsScreen,
  openProfessionsScreen,
  openTitlesScreen,
  openEquipmentScreen,
}: GameKeyboardOptions) {
  useEffect(() => {
    const screenShortcuts: Record<string, ScreenShortcut> = {
      Escape: { screen: "config", open: openConfigScreen },
      i: { screen: "inventory", open: openInventoryScreen },
      I: { screen: "inventory", open: openInventoryScreen },
      q: { screen: "missions", open: openQuestsScreen },
      Q: { screen: "missions", open: openQuestsScreen },
      p: { screen: "professions", open: openProfessionsScreen },
      P: { screen: "professions", open: openProfessionsScreen },
      t: { screen: "titles", open: openTitlesScreen },
      T: { screen: "titles", open: openTitlesScreen },
      e: { screen: "equipment", open: openEquipmentScreen },
      E: { screen: "equipment", open: openEquipmentScreen },
    };

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

        if (
          controls.blockGlobalOpen &&
          playerModeRef.current === "explore"
        ) {
          closeAllMenus();
          return;
        }

        if (
          !controls.blockGlobalOpen &&
          playerModeRef.current === "explore"
        ) {
          openNavbar();
        }

        return;
      }

      const shortcut = screenShortcuts[e.key];

      if (shortcut) {
        if (
          isNavOpenRef.current &&
          screenRef.current === shortcut.screen
        ) {
          closeNavbar();
        } else {
          shortcut.open();
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

      if (
        e.key === "Shift" &&
        playerModeRef.current === "battle"
      ) {
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
    openConfigScreen,
    openInventoryScreen,
    openQuestsScreen,
    openProfessionsScreen,
    openTitlesScreen,
    openEquipmentScreen,
  ]);
}