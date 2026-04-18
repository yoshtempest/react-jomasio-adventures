import { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { GameControlLayer } from "@/utils/types/controls";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

type ControlsContextType = {
  pushControls: (controls: GameControlLayer) => void;
  popControls: () => void;
  clearControls: () => void;
  activeControls?: GameControlLayer; // 👈 ADICIONA ISSO
};

const GameControlsContext = createContext<ControlsContextType | null>(null);

export function GameControlsProvider({ children }: Props) {
  const [stack, setStack] = useState<GameControlLayer[]>([]);
  
  const pushControls = useCallback((controls: GameControlLayer) => {
    setStack((prev) => [...prev, controls]);
  }, []);

  const popControls = useCallback(() => {
    setStack((prev) => prev.slice(0, -1));
  }, []);

  const clearControls = useCallback(() => {
    setStack([]);
  }, []);

  // 🎮 input global
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const active = stack[stack.length - 1];

      if (!active) return;

      switch (e.key) {
        case "l":
          active.onConfirm?.();
          break;

        case "b":
          active.onCancel?.();
          break;

        case "g":
          active.onOpen?.();
          break;
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [stack]);

  return (
    <GameControlsContext.Provider
      value={{
        pushControls,
        popControls,
        clearControls,
        activeControls: stack[stack.length - 1],
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