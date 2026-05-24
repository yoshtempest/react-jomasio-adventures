import type { QuestId } from "@/data/quests";

export const hasQuest = (
  quests: { id: QuestId }[],
  id: QuestId
) => {
  return quests.some(q => q.id === id);
};

export const hasAnyQuest = (
  quests: { id: QuestId }[],
  ids: QuestId[]
) => {
  return quests.some(q => ids.includes(q.id));
};

export const hasItem = (
  items: { id: string }[],
  id: string
) => {
  return items.some(item => item.id === id);
};

export const hasAnyItem = (
  items: { id: string }[],
  ids: string[]
) => {
  return items.some(item => ids.includes(item.id));
};

export const hasFlag = (
  flags: string[],
  flag: string
) => {
  return flags.includes(flag);
};

export const hasAnyFlag = (
  flags: string[],
  flagList: string[]
) => {
  return flagList.some(flag =>
    flags.includes(flag)
  );
};