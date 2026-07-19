export type Condition = {
  hasItem?: ItemId;
  notHasItem?: ItemId;
  hasQuest?: QuestId;
  notHasQuest?: QuestId;
  hasFlag?: FlagId;
  notHasFlag?: FlagId;
  lastPage?: LastPage;
  notLastPage?: LastPage;
};
