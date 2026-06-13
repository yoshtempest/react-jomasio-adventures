import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

export type DialogueSpeed = "fast" | "normal" | "slow";

type SettingsContextType = {
  dialogueSpeed: DialogueSpeed;
  setDialogueSpeed: (speed: DialogueSpeed) => void;
  dialogueSpeedMs: number;
};

export const DIALOGUE_SPEED_LIST: DialogueSpeed[] = ["fast", "normal", "slow"];

export const SPEED_LABEL: Record<DialogueSpeed, string> = {
  fast: "Rápido",
  normal: "Normal",
  slow: "Devagar",
};

const SPEED_MAP: Record<DialogueSpeed, number> = {
  fast: 25,
  normal: 50,
  slow: 90,
};

const STORAGE_KEY = "dialogue_speed";

const SettingsContext = createContext<SettingsContextType | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [dialogueSpeed, setDialogueSpeedState] = useState<DialogueSpeed>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "fast" || saved === "normal" || saved === "slow") return saved;
    return "normal";
  });

  const setDialogueSpeed = useCallback((speed: DialogueSpeed) => {
    setDialogueSpeedState(speed);
    localStorage.setItem(STORAGE_KEY, speed);
  }, []);

  const dialogueSpeedMs = SPEED_MAP[dialogueSpeed];

  return (
    <SettingsContext.Provider value={{ dialogueSpeed, setDialogueSpeed, dialogueSpeedMs }}>
      {children}
    </SettingsContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings precisa do SettingsProvider");
  return ctx;
}
