import { HISTORY_QUESTS } from "./history";
import { SIDE_QUESTS } from "./sidequests";
import { BATTLE_QUESTS } from "./battle";

export const QUESTS = {
  ...HISTORY_QUESTS,
  ...SIDE_QUESTS,
  ...BATTLE_QUESTS,
} as const;

export type QuestId = keyof typeof QUESTS;