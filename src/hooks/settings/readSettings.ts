import type { Settings } from "./constants";
import type { DialogueSpeed } from "@/utils/settings";
import {
  DIALOGUE_SPEED_KEY,
  SHOW_QUEST_INDICATOR_KEY,
  SHOW_COMBO_ACTION_KEY,
  SHOW_HIGHLIGHT_KEY,
  SHARED_XP_KEY,
  DIFFICULTY_KEY,
} from "@/data/storageKeys";
import { slotKey } from "@/services/save/slotManager";

export function readSettings(): Settings {
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
