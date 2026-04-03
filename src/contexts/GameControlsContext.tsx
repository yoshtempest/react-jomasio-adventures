import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { usePlayer } from "./PlayerContext";

type Controls = {
  onConfirm?: () => void;
  onCancel?: () => void;

  setOnConfirm: (fn?: () => void) => void;
  setOnCancel: (fn?: () => void) => void;

  clearControls: () => void;
};

const GameControlsContext = createContext<Controls | null>(null);

export function GameControlsProvider({ children }: { children: ReactNode }) {
  const [onConfirm, setOnConfirm] = useState<(() => void) | undefined>();
  const [onCancel, setOnCancel] = useState<(() => void) | undefined>();

  const { player, special, openInventory } = usePlayer(); // 👈 NOVO

  function clearControls() {
    setOnConfirm(undefined);
    setOnCancel(undefined);
  }

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      switch (e.key) {
        case "l":
          onConfirm?.();
          break;

        case "b":
          if (onCancel) {
            onCancel();
            return;
          }

          // 🧠 fallback inteligente
          if (player.mode === "battle") {
            special();
          } else {
            openInventory();
          }
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onConfirm, onCancel, player.mode, special, openInventory]);

  return (
    <GameControlsContext.Provider
      value={{
        onConfirm,
        onCancel,
        setOnConfirm,
        setOnCancel,
        clearControls,
      }}
    >
      {children}
    </GameControlsContext.Provider>
  );
}

export function useGameControls() {
  const context = useContext(GameControlsContext);
  if (!context) {
    throw new Error("useGameControls precisa do GameControlsProvider");
  }
  return context;
}