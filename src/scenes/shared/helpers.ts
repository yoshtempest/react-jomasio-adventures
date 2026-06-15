export const hasQuest = (quests: { id: QuestId }[], id: QuestId) => {
  return quests.some((q) => q.id === id);
};

export const hasAnyQuest = (quests: { id: QuestId }[], ids: QuestId[]) => {
  return quests.some((q) => ids.includes(q.id));
};

export const playerCharacter = (character: CharacterId, id: CharacterId) => {
  return character === id;
};

export const hasItem = (items: { id: ItemId }[], id: ItemId) => {
  return items.some((item) => item.id === id);
};

export const hasAnyItem = (items: { id: ItemId }[], ids: ItemId[]) => {
  return items.some((item) => ids.includes(item.id));
};

export const hasFlag = (flags: FlagId[], id: FlagId) => {
  return flags.includes(id);
};

export const hasAnyFlag = (flags: FlagId[], ids: FlagId[]) => {
  return ids.some((id) => flags.includes(id));
};
