import { createContext, useContext, useState, type ReactNode } from "react";

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

  function clearControls() {
    setOnConfirm(undefined);
    setOnCancel(undefined);
  }

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