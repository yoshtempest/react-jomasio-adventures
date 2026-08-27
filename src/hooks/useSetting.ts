import { useSyncExternalStore, useCallback, useMemo } from "react";
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
import { slotKey } from "@/services/save/slotManager";

type Settings = {
  dialogueSpeed: DialogueSpeed;
  showQuestIndicator: boolean;
  showComboAction: boolean;
  showHighlight: boolean;
  sharedXp: boolean;
  difficulty: NpcDifficulty;
};

function readSettings(): Settings {
  const raw = localStorage.getItem(DIALOGUE_SPEED_KEY);
  let dialogueSpeed: DialogueSpeed = "normal";
  if (raw === "fast" || raw === "normal" || raw === "slow") dialogueSpeed = raw;

  const showQuestIndicator =
    localStorage.getItem(SHOW_QUEST_INDICATOR_KEY) === "true";
  const showComboAction =
    localStorage.getItem(SHOW_COMBO_ACTION_KEY) !== "false";
  const showHighlight = localStorage.getItem(SHOW_HIGHLIGHT_KEY) !== "false";
  const sharedXp = localStorage.getItem(SHARED_XP_KEY) === "true";

  const rawDiff = localStorage.getItem(slotKey(DIFFICULTY_KEY));
  let difficulty: NpcDifficulty = "medium";
  if (
    rawDiff === "easy" ||
    rawDiff === "medium" ||
    rawDiff === "hard" ||
    rawDiff === "insano"
  ) {
    difficulty = rawDiff;
  }

  return {
    dialogueSpeed,
    showQuestIndicator,
    showComboAction,
    showHighlight,
    sharedXp,
    difficulty,
  };
}

let cached = readSettings();

const listeners = new Set<() => void>();

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): Settings {
  return cached;
}

function emitChange(): void {
  cached = readSettings();
  for (const l of listeners) l();
}

export type SettingsReturn = Settings & {
  dialogueSpeedMs: number;
  setDialogueSpeed: (speed: DialogueSpeed) => void;
  setShowQuestIndicator: (show: boolean) => void;
  setShowComboAction: (show: boolean) => void;
  setShowHighlight: (show: boolean) => void;
  setSharedXp: (shared: boolean) => void;
  setDifficulty: (difficulty: NpcDifficulty) => void;
};

export function useSettings(): SettingsReturn {
  const s = useSyncExternalStore(subscribe, getSnapshot);

  const setDialogueSpeed = useCallback((speed: DialogueSpeed) => {
    localStorage.setItem(DIALOGUE_SPEED_KEY, speed);
    emitChange();
  }, []);

  const setShowQuestIndicator = useCallback((show: boolean) => {
    localStorage.setItem(SHOW_QUEST_INDICATOR_KEY, String(show));
    emitChange();
  }, []);

  const setShowComboAction = useCallback((show: boolean) => {
    localStorage.setItem(SHOW_COMBO_ACTION_KEY, String(show));
    emitChange();
  }, []);

  const setShowHighlight = useCallback((show: boolean) => {
    localStorage.setItem(SHOW_HIGHLIGHT_KEY, String(show));
    emitChange();
  }, []);

  const setSharedXp = useCallback((shared: boolean) => {
    localStorage.setItem(SHARED_XP_KEY, String(shared));
    emitChange();
  }, []);

  const setDifficulty = useCallback((difficulty: NpcDifficulty) => {
    localStorage.setItem(slotKey(DIFFICULTY_KEY), difficulty);
    emitChange();
  }, []);

  return useMemo(
    () => ({
      ...s,
      dialogueSpeedMs: SPEED_MAP[s.dialogueSpeed],
      setDialogueSpeed,
      setShowQuestIndicator,
      setShowComboAction,
      setShowHighlight,
      setSharedXp,
      setDifficulty,
    }),
    [
      s,
      setDialogueSpeed,
      setShowQuestIndicator,
      setShowComboAction,
      setShowHighlight,
      setSharedXp,
      setDifficulty,
    ],
  );
}
