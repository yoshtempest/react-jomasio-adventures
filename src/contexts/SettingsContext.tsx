import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import type { DialogueSpeed } from "@/utils/settings";
import { SPEED_MAP } from "@/data/settings/dialogueSpeed";
import { DIALOGUE_SPEED_KEY, SHOW_QUEST_INDICATOR_KEY } from "@/data/storageKeys";

type SettingsContextType = {
  dialogueSpeed: DialogueSpeed;
  setDialogueSpeed: (speed: DialogueSpeed) => void;
  dialogueSpeedMs: number;
  showQuestIndicator: boolean;
  setShowQuestIndicator: (show: boolean) => void;
};

const SettingsContext = createContext<SettingsContextType | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [dialogueSpeed, setDialogueSpeedState] = useState<DialogueSpeed>(() => {
    const saved = localStorage.getItem(DIALOGUE_SPEED_KEY);
    if (saved === "fast" || saved === "normal" || saved === "slow")
      return saved;
    return "normal";
  });

  const setDialogueSpeed = useCallback((speed: DialogueSpeed) => {
    setDialogueSpeedState(speed);
    localStorage.setItem(DIALOGUE_SPEED_KEY, speed);
  }, []);

  const [showQuestIndicator, setShowQuestIndicatorState] = useState<boolean>(() => {
    const saved = localStorage.getItem(SHOW_QUEST_INDICATOR_KEY);
    return saved === "true";
  });

  const setShowQuestIndicator = useCallback((show: boolean) => {
    setShowQuestIndicatorState(show);
    localStorage.setItem(SHOW_QUEST_INDICATOR_KEY, String(show));
  }, []);

  const dialogueSpeedMs = SPEED_MAP[dialogueSpeed];

  return (
    <SettingsContext.Provider
      value={{
        dialogueSpeed,
        setDialogueSpeed,
        dialogueSpeedMs,
        showQuestIndicator,
        setShowQuestIndicator,
      }}
    >
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
