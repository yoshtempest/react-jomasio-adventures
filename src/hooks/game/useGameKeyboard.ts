import { useEffect } from "react";
import type { RefObject } from "react";

import type { GameControlLayer } from "@/utils/types/player/controls";
import type { NavScreen } from "@/utils/types/player/navbar";
import {
  KEY_ACTIONS,
  KEY_RELEASE_ACTIONS,
  SCREEN_SHORTCUT_KEYS,
} from "@/data/keyActions";

/**
 * Ações em que o auto-repeat do teclado não pode virar repetição.
 *
 * Segurar `L` disparava `onConfirm` dezenas de vezes por segundo, o que
 * atropelava diálogo inteiro em menos de um segundo e tornava impossível
 * distinguir um toque de um toque longo — que é o gesto de pular cutscene.
 * Direcional fica de fora de propósito: repetir é o comportamento
 * esperado ao segurar a seta num menu ou na batalha.
 */
const NO_AUTO_REPEAT_ACTIONS = new Set(["onConfirm", "onCancel"]);

type GameKeyboardOptions = {
  controlsRef: RefObject<GameControlLayer>;
  playerModeRef: RefObject<string>;
  isNavOpenRef: RefObject<boolean>;
  screenRef: RefObject<string | undefined>;
  isBattleNavOpenRef: RefObject<boolean>;

  openNavbar: () => void;
  closeAllMenus: () => void;

  closeNavbar: () => void;
  openScreen: (screen: Exclude<NavScreen, "menu">) => void;
  toggleBattleNavbar: () => void;
};

export function useGameKeyboard({
  controlsRef,
  playerModeRef,
  isNavOpenRef,
  screenRef,
  isBattleNavOpenRef,

  openNavbar,
  closeAllMenus,

  closeNavbar,
  openScreen,
  toggleBattleNavbar,
}: GameKeyboardOptions) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const controls = controlsRef.current;

      const action = KEY_ACTIONS[e.key];

      if (action) {
        if (e.repeat && NO_AUTO_REPEAT_ACTIONS.has(action)) return;
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
        // Em batalha, configurações abrem a BattleNavbar (que pausa a luta).
        if (
          shortcutScreen === "config" &&
          (playerModeRef.current === "battle" || isBattleNavOpenRef.current)
        ) {
          toggleBattleNavbar();
          return;
        }

        // BattleNavbar aberta: ignora os demais atalhos de tela.
        if (isBattleNavOpenRef.current) return;

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
    isBattleNavOpenRef,

    openNavbar,
    closeAllMenus,
    closeNavbar,
    openScreen,
    toggleBattleNavbar,
  ]);
}
