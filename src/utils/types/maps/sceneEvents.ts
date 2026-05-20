import type { QuestId } from "@/data/quests";
import type { ItemId } from "@/data/items";


export type SceneEvent =
  | { type: "openModal"; modal: "class" }
  | { type: "navigate"; to: string }
  | { type: "setFlag"; key: string; value: boolean }
  | { type: "log"; message: string }
  | { type: "progressQuest"; id: string; value: number }
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

        lastPage?: string;
        notLastPage?: string;
      };
      then: SceneEvent[];
      else?: SceneEvent[];
    };