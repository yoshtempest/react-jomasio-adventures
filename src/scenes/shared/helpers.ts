import type { QuestId } from "@/data/quests";
import type { ItemId } from "@/data/items";
import type { FlagId } from "@/data/flags";

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
  items: { id: ItemId }[],
  id: ItemId
) => {
  return items.some(item => item.id === id);
};

export const hasAnyItem = (
  items: { id: ItemId }[],
  ids: ItemId[]
) => {
  return items.some(item => ids.includes(item.id));
};

export const hasFlag = (
  flags: { id: FlagId}[],
  id: FlagId
) => {
  return flags.some(flag => flag.id === id);
};

export const hasAnyFlag = (
  flags: { id: FlagId}[],
  ids: FlagId[]
) => {
  return flags.some(flag => ids.includes(flag.id));
};