import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import type { DialogueSpeed } from "@/utils/settings";
import { SPEED_MAP } from "@/data/settings/dialogueSpeed";
import {
  DIALOGUE_SPEED_KEY,
  SHOW_QUEST_INDICATOR_KEY,
  SHOW_COMBO_ACTION_KEY,
  SHOW_HIGHLIGHT_KEY,
  SHARED_XP_KEY,
  DIFFICULTY_KEY,
} from "@/data/storageKeys";
import { slotKey } from "@/utils/save/slotManager";

type SettingsContextType = {
  dialogueSpeed: DialogueSpeed;
  setDialogueSpeed: (speed: DialogueSpeed) => void;
  dialogueSpeedMs: number;
  showQuestIndicator: boolean;
  setShowQuestIndicator: (show: boolean) => void;
  showComboAction: boolean;
  setShowComboAction: (show: boolean) => void;
  showHighlight: boolean;
  setShowHighlight: (show: boolean) => void;
  sharedXp: boolean;
  setSharedXp: (shared: boolean) => void;
  difficulty: NpcDifficulty;
  setDifficulty: (difficulty: NpcDifficulty) => void;
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

  const [showQuestIndicator, setShowQuestIndicatorState] = useState<boolean>(
    () => {
      const saved = localStorage.getItem(SHOW_QUEST_INDICATOR_KEY);
      return saved === "true";
    },
  );

  const setShowQuestIndicator = useCallback((show: boolean) => {
    setShowQuestIndicatorState(show);
    localStorage.setItem(SHOW_QUEST_INDICATOR_KEY, String(show));
  }, []);

  const [showComboAction, setShowComboActionState] = useState<boolean>(() => {
    const saved = localStorage.getItem(SHOW_COMBO_ACTION_KEY);
    return saved !== "false";
  });

  const setShowComboAction = useCallback((show: boolean) => {
    setShowComboActionState(show);
    localStorage.setItem(SHOW_COMBO_ACTION_KEY, String(show));
  }, []);

  const [showHighlight, setShowHighlightState] = useState<boolean>(() => {
    const saved = localStorage.getItem(SHOW_HIGHLIGHT_KEY);
    return saved !== "false";
  });

  const setShowHighlight = useCallback((show: boolean) => {
    setShowHighlightState(show);
    localStorage.setItem(SHOW_HIGHLIGHT_KEY, String(show));
  }, []);

  const [sharedXp, setSharedXpState] = useState<boolean>(() => {
    const saved = localStorage.getItem(SHARED_XP_KEY);
    return saved === "true";
  });

  const setSharedXp = useCallback((shared: boolean) => {
    setSharedXpState(shared);
    localStorage.setItem(SHARED_XP_KEY, String(shared));
  }, []);

  const [difficulty, setDifficultyState] = useState<NpcDifficulty>(() => {
    const saved = localStorage.getItem(slotKey(DIFFICULTY_KEY));
    if (
      saved === "easy" ||
      saved === "medium" ||
      saved === "hard" ||
      saved === "insano"
    )
      return saved;
    return "medium";
  });

  const setDifficulty = useCallback((newDifficulty: NpcDifficulty) => {
    setDifficultyState(newDifficulty);
    localStorage.setItem(slotKey(DIFFICULTY_KEY), newDifficulty);
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
        showComboAction,
        setShowComboAction,
        showHighlight,
        setShowHighlight,
        sharedXp,
        setSharedXp,
        difficulty,
        setDifficulty,
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
