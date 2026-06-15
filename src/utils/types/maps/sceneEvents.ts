export type SceneEvent =
  | { type: "openModal"; modal: "class" }
  | { type: "navigate"; to: string }
  | { type: "setFlag"; flagId: FlagId }
  | { type: "log"; message: string }
  | { type: "progressQuest"; id: QuestId; value: number }
  | { type: "giveQuest"; questId: QuestId }
  | { type: "addItem"; itemId: ItemId }
  | { type: "removeItem"; itemId: ItemId } // 👈 NOVO
  | {
      type: "conditional";
      condition: {
        hasItem?: ItemId;
        notHasItem?: ItemId;

        hasQuest?: QuestId;
        notHasQuest?: QuestId;

        hasFlag?: FlagId;
        notHasFlag?: FlagId;

        lastPage?: LastPage;
        notLastPage?: LastPage;
      };
      then: SceneEvent[];
      else?: SceneEvent[];
    };
