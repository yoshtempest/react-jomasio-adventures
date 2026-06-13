import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import type { DialogueSpeed } from "@/utils/settings";

const SPEED_MAP: Record<DialogueSpeed, number> = {
  fast: 25,
  normal: 50,
  slow: 90,
};

type SettingsContextType = {
  dialogueSpeed: DialogueSpeed;
  setDialogueSpeed: (speed: DialogueSpeed) => void;
  dialogueSpeedMs: number;
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
