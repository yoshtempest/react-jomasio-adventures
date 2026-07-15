import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from "react";
import type { GameControlLayer } from "@/utils/types/player/controls";
import type { ReactNode } from "react";
import { usePlayer } from "@/contexts/PlayerContext";
import { useNavbar } from "@/contexts/NavbarContext";
import { shouldConsumeInput } from "@/gameRules/movement/input";

type Props = {
  children: ReactNode;
};

type ControlsContextType = {
  pushControls: (controls: GameControlLayer) => void;
  popControls: () => void;
  clearControls: () => void;
  closeAllMenus: () => void;
  activeControls: GameControlLayer;
};

const GameControlsContext = createContext<ControlsContextType | null>(null);

export function GameControlsProvider({ children }: Props) {
  const [stack, setStack] = useState<GameControlLayer[]>([]);
  const { player, setMode } = usePlayer();
  const { openNavbar, closeNavbar, openConfigScreen, isNavOpen, screen } = useNavbar();
  const closeNavbarRef = useRef(closeNavbar);
  closeNavbarRef.current = closeNavbar;
  const openConfigScreenRef = useRef(openConfigScreen);
  openConfigScreenRef.current = openConfigScreen;
  const isNavOpenRef = useRef(isNavOpen);
  isNavOpenRef.current = isNavOpen;
  const screenRef = useRef(screen);
  screenRef.current = screen;
  const setModeRef = useRef(setMode);
  setModeRef.current = setMode;

  const pushControls = useCallback((controls: GameControlLayer) => {
    setStack((prev) => [...prev, controls]);
  }, []);

  const popControls = useCallback(() => {
    setStack((prev) => prev.slice(0, -1));
  }, []);

  const clearControls = useCallback(() => {
    setStack([]);
  }, []);

  const closeAllMenus = useCallback(() => {
    closeNavbarRef.current();
    setModeRef.current("explore");
  }, []);

  // 🔥 merge inteligente
  const activeControls = useMemo((): GameControlLayer => {
    const top = stack[stack.length - 1];

    return stack.reduce(
      (acc, layer) => ({
        // 🎮 movimento pode mesclar
        onUp: () => {
          for (let i = stack.length - 1; i >= 0; i--) {
            const handled = stack[i].onUp?.();
            if (shouldConsumeInput(handled)) break;
          }
        },

        onDown: () => {
          for (let i = stack.length - 1; i >= 0; i--) {
            const handled = stack[i].onDown?.();
            if (shouldConsumeInput(handled)) break;
          }
        },

        onLeft: () => {
          for (let i = stack.length - 1; i >= 0; i--) {
            const handled = stack[i].onLeft?.();
            if (shouldConsumeInput(handled)) break;
          }
        },

        onRight: () => {
          for (let i = stack.length - 1; i >= 0; i--) {
            const handled = stack[i].onRight?.();
            if (shouldConsumeInput(handled)) break;
          }
        },

        onConfirmRelease: layer.onConfirmRelease ?? acc.onConfirmRelease,
        onCancelRelease: layer.onCancelRelease ?? acc.onCancelRelease,

        onUpRelease: layer.onUpRelease ?? acc.onUpRelease,
        onDownRelease: layer.onDownRelease ?? acc.onDownRelease,
        onLeftRelease: layer.onLeftRelease ?? acc.onLeftRelease,
        onRightRelease: layer.onRightRelease ?? acc.onRightRelease,

        // 🚨 AQUI É A CORREÇÃO
        onConfirm: () => {
          for (let i = stack.length - 1; i >= 0; i--) {
            const handled = stack[i].onConfirm?.();
            if (shouldConsumeInput(handled)) break;
          }
        },

        onCancel: () => {
          for (let i = stack.length - 1; i >= 0; i--) {
            const handled = stack[i].onCancel?.();
            if (shouldConsumeInput(handled)) break;
          }
        },
        onOpen: top?.onOpen,

        blockGlobalOpen: top?.blockGlobalOpen ?? false,
      }),
      {} as GameControlLayer,
    );
  }, [stack]);

  const activeControlsRef = useRef(activeControls);
  activeControlsRef.current = activeControls;

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const controls = activeControlsRef.current;

      switch (e.key) {
        case "ArrowUp":
        case "w":
        case "W":
          controls.onUp?.();
          break;

        case "ArrowDown":
        case "s":
        case "S":
          controls.onDown?.();
          break;

        case "ArrowLeft":
        case "a":
          controls.onLeft?.();
          break;

        case "ArrowRight":
        case "d":
        case "D":
          controls.onRight?.();
          break;

        case "l":
        case "L":
        case "A":
        case "Enter":
          controls.onConfirm?.();
          break;

        case "b":
        case "B":
        case "x":
        case "X":
        case "Delete":
          controls.onCancel?.();
          break;

        case "Shift":
          if (player.mode === "battle") {
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

          if (controls.blockGlobalOpen && player.mode === "explore") {
            closeAllMenus();
            return;
          }

          if (!controls.blockGlobalOpen && player.mode === "explore") {
            openNavbar();
          }
          break;

        case "Escape":
          if (isNavOpenRef.current && screenRef.current === "config") {
            closeNavbarRef.current();
          } else {
            openConfigScreenRef.current();
          }
          break;
      }
    }

    function handleKeyUp(e: KeyboardEvent) {
      const controls = activeControlsRef.current;

      switch (e.key) {
        case "ArrowUp":
        case "w":
        case "W":
          controls.onUpRelease?.();
          break;

        case "ArrowDown":
        case "s":
        case "S":
          controls.onDownRelease?.();
          break;

        case "ArrowLeft":
        case "a":
          controls.onLeftRelease?.();
          break;

        case "ArrowRight":
        case "d":
        case "D":
          controls.onRightRelease?.();
          break;

        case "l":
        case "L":
        case "A":
          controls.onConfirmRelease?.();
          break;

        case "b":
        case "B":
        case "x":
        case "X":
          controls.onCancelRelease?.();
          break;

        case "Shift":
          if (player.mode === "battle") {
            controls.onDownRelease?.();
          }
          break;
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [player.mode, openNavbar, closeAllMenus, openConfigScreen]);

  return (
    <GameControlsContext.Provider
      value={{
        pushControls,
        popControls,
        clearControls,
        closeAllMenus,
        activeControls,
      }}
    >
      {children}
    </GameControlsContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useGameControls() {
  const ctx = useContext(GameControlsContext);
  if (!ctx) throw new Error("useGameControls precisa do provider");
  return ctx;
}
