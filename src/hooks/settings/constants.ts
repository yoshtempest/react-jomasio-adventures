import { createExternalStore } from "@/utils/createExternalStore";
import type { DialogueSpeed } from "@/utils/settings";
import { readSettings } from "./readSettings";

export type Settings = {
  dialogueSpeed: DialogueSpeed;
  showQuestIndicator: boolean;
  showComboAction: boolean;
  showHighlight: boolean;
  sharedXp: boolean;
  difficulty: NpcDifficulty;
};

export const settingsStore = createExternalStore(readSettings);

export type SettingsReturn = Settings & {
  dialogueSpeedMs: number;
  setDialogueSpeed: (speed: DialogueSpeed) => void;
  setShowQuestIndicator: (show: boolean) => void;
  setShowComboAction: (show: boolean) => void;
  setShowHighlight: (show: boolean) => void;
  setSharedXp: (shared: boolean) => void;
  setDifficulty: (difficulty: NpcDifficulty) => void;
};
