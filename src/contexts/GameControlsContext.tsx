import { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { GameControlLayer } from "@/utils/types/controls";
import type { ReactNode } from "react";
import { usePlayer } from "@/contexts/PlayerContext";
import { useNavbar } from "@/contexts/NavbarContext";

type Props = {
  children: ReactNode;
};

type ControlsContextType = {
  pushControls: (controls: GameControlLayer) => void;
  popControls: () => void;
  clearControls: () => void;
  activeControls: GameControlLayer;
};

const GameControlsContext = createContext<ControlsContextType | null>(null);

export function GameControlsProvider({ children }: Props) {
  const [stack, setStack] = useState<GameControlLayer[]>([]);
  const { player } = usePlayer();
  const { openNavbar } = useNavbar();

  const pushControls = useCallback((controls: GameControlLayer) => {
    setStack((prev) => [...prev, controls]);
  }, []);

  const popControls = useCallback(() => {
    setStack((prev) => prev.slice(0, -1));
  }, []);

  const clearControls = useCallback(() => {
    setStack([]);
  }, []);

  // 🔥 merge inteligente
  const getMergedControls = useCallback((): GameControlLayer => {
    const top = stack[stack.length - 1];

    return stack.reduce((acc, layer) => ({
      // 🎮 movimento pode mesclar
      onUp: () => {
        for (let i = stack.length - 1; i >= 0; i--) {
          const handled = stack[i].onUp?.();
          if (handled === true) break
        }
      },

      onDown: () => {
        for (let i = stack.length - 1; i >= 0; i--) {
          const handled = stack[i].onDown?.();
          if (handled === true) break;
        }
      },

      onLeft: () => {
        for (let i = stack.length - 1; i >= 0; i--) {
          const handled = stack[i].onLeft?.();
          if (handled === true) break;
        }
      },

      onRight: () => {
        for (let i = stack.length - 1; i >= 0; i--) {
          const handled = stack[i].onRight?.();
          if (handled === true) break;
        }
      },

      onUpRelease: layer.onUpRelease ?? acc.onUpRelease,
      onDownRelease: layer.onDownRelease ?? acc.onDownRelease,
      onLeftRelease: layer.onLeftRelease ?? acc.onLeftRelease,
      onRightRelease: layer.onRightRelease ?? acc.onRightRelease,

      // 🚨 AQUI É A CORREÇÃO
      onConfirm: () => {
        for (let i = stack.length - 1; i >= 0; i--) {
          const handled = stack[i].onConfirm?.();
          if (handled === true) break;
        }
      },

      onCancel: () => {
        for (let i = stack.length - 1; i >= 0; i--) {
          const handled = stack[i].onCancel?.();
          if (handled === true) break;
        }
      },
      onOpen: top?.onOpen,

      blockGlobalOpen: top?.blockGlobalOpen ?? false,
    }), {} as GameControlLayer);
  }, [stack]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const active = getMergedControls();
      if (!active) return;

      switch (e.key) {
        case "ArrowUp":
        case "w":
          active.onUp?.();
          break;

        case "ArrowDown":
        case "s":
          active.onDown?.();
          break;

        case "ArrowLeft":
        case "a":
          active.onLeft?.();
          break;

        case "ArrowRight":
        case "d":
          active.onRight?.();
          break;

        case "l":
          active.onConfirm?.();
          break;

        case "b":
          active.onCancel?.();
          break;

        case "g":
          if (active.onOpen) {
            active.onOpen();
            return;
          }

          if (!active.blockGlobalOpen && player.mode === "explore") {
            openNavbar();
          }
          break;
      }
    }

    function handleKeyUp(e: KeyboardEvent) {
      const active = getMergedControls();
      if (!active) return;

      switch (e.key) {
        case "ArrowUp":
        case "w":
          active.onUpRelease?.();
          break;

        case "ArrowDown":
        case "s":
          active.onDownRelease?.();
          break;

        case "ArrowLeft":
        case "a":
          active.onLeftRelease?.();
          break;

        case "ArrowRight":
        case "d":
          active.onRightRelease?.();
          break;
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [getMergedControls, player.mode, openNavbar]);

  return (
    <GameControlsContext.Provider
      value={{
        pushControls,
        popControls,
        clearControls,
        activeControls: getMergedControls(),
      }}
    >
      {children}
    </GameControlsContext.Provider>
  );
}

export function useGameControls() {
  const ctx = useContext(GameControlsContext);
  if (!ctx) throw new Error("useGameControls precisa do provider");
  return ctx;
}