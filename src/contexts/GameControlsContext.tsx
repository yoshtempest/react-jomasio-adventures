import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
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
  const activeControls = useMemo((): GameControlLayer => {
    const top = stack[stack.length - 1];

    return stack.reduce((acc, layer) => ({
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
    }), {} as GameControlLayer);
  }, [stack]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      switch (e.key) {
        case "ArrowUp":
        case "w":
          activeControls.onUp?.();
          break;

        case "ArrowDown":
        case "s":
          activeControls.onDown?.();
          break;

        case "ArrowLeft":
        case "a":
          activeControls.onLeft?.();
          break;

        case "ArrowRight":
        case "d":
          activeControls.onRight?.();
          break;

        case "l":
          activeControls.onConfirm?.();
          break;

        case "b":
          activeControls.onCancel?.();
          break;

        case "g":
          if (activeControls.onOpen) {
            activeControls.onOpen();
            return;
          }

          if (!activeControls.blockGlobalOpen && player.mode === "explore") {
            openNavbar();
          }
          break;
      }
    }

    function handleKeyUp(e: KeyboardEvent) {
      if (!activeControls) return;

      switch (e.key) {
        case "ArrowUp":
        case "w":
          activeControls.onUpRelease?.();
          break;

        case "ArrowDown":
        case "s":
          activeControls.onDownRelease?.();
          break;

        case "ArrowLeft":
        case "a":
          activeControls.onLeftRelease?.();
          break;

        case "ArrowRight":
        case "d":
          activeControls.onRightRelease?.();
          break;
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [activeControls, player.mode, openNavbar]);

  return (
    <GameControlsContext.Provider
      value={{
        pushControls,
        popControls,
        clearControls,
        activeControls,
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