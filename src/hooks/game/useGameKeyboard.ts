import { useEffect } from "react";
import type { RefObject } from "react";

import type { GameControlLayer } from "@/utils/types/player/controls";
import {
  KEY_ACTIONS,
  KEY_RELEASE_ACTIONS,
} from "@/data/keyActions";

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
    function handleKeyDown(e: KeyboardEvent) {
      const controls = controlsRef.current;

      const action = KEY_ACTIONS[e.key];

      if (action) {
        controls[action]?.();
        return;
      }

      switch (e.key) {
        case "Shift":
          if (playerModeRef.current === "battle") {
            controls.onDown?.();
          }
          break;

        case "g":
        case "G":
        case "Tab":
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

          break;

        case "Escape":
          if (
            isNavOpenRef.current &&
            screenRef.current === "config"
          ) {
            closeNavbar();
          } else {
            openConfigScreen();
          }

          break;

        case "i":
        case "I":
          if (
            isNavOpenRef.current &&
            screenRef.current === "inventory"
          ) {
            closeNavbar();
          } else {
            openInventoryScreen();
          }

          break;

        case "q":
        case "Q":
          if (
            isNavOpenRef.current &&
            screenRef.current === "missions"
          ) {
            closeNavbar();
          } else {
            openQuestsScreen();
          }

          break;

        case "p":
        case "P":
          if (
            isNavOpenRef.current &&
            screenRef.current === "professions"
          ) {
            closeNavbar();
          } else {
            openProfessionsScreen();
          }

          break;

        case "t":
        case "T":
          if (
            isNavOpenRef.current &&
            screenRef.current === "titles"
          ) {
            closeNavbar();
          } else {
            openTitlesScreen();
          }

          break;

        case "e":
        case "E":
          if (
            isNavOpenRef.current &&
            screenRef.current === "equipment"
          ) {
            closeNavbar();
          } else {
            openEquipmentScreen();
          }

          break;
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