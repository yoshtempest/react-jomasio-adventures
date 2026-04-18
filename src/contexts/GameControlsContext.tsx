import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { usePlayer } from "./PlayerContext";

type Controls = {
  onConfirm?: () => void;
  onCancel?: () => void;
  onOpen?: () => void;

  setOnConfirm: (fn?: () => void) => void;
  setOnCancel: (fn?: () => void) => void;
  setOnOpen: (fn?: () => void) => void;

  clearControls: () => void;
};

const GameControlsContext = createContext<Controls | null>(null);

export function GameControlsProvider({ children }: { children: ReactNode }) {
  const [onConfirm, setOnConfirm] = useState<(() => void) | undefined>();
  const [onCancel, setOnCancel] = useState<(() => void) | undefined>();
  const [onOpen, setOnOpen] = useState<(() => void) | undefined>();

  const { player, special, openInventory, openNavbar } = usePlayer(); // 👈 NOVO

  function clearControls() {
    setOnConfirm(undefined);
    setOnCancel(undefined);
    setOnOpen(undefined);
  }

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      switch (e.key) {
        case "g":
          if (onOpen) {
            onOpen();
            return;
          }
          if (player.mode === "explore") {
            openNavbar();
          }
          break;
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
  }, [onConfirm, onCancel, onOpen, player.mode, special, openInventory]);

  return (
    <GameControlsContext.Provider
      value={{
        onConfirm,
        onCancel,
        onOpen,
        setOnConfirm,
        setOnCancel,
        setOnOpen,
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