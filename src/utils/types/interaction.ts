import type { ItemId } from "@/data/items";
import type { QuestId } from "@/data/quests";
import type { InventoryItem } from "@/utils/types/player/inventory";

export type BaseDeps = {
  setPopup: (msg: string) => void;
};

export type InventoryDeps = BaseDeps & {
  hasItem: (id: ItemId) => boolean;
  addItem: (item: InventoryItem) => void;
  removeItem: (id: ItemId) => void;
  navigate?: (path: string) => void;
};

export type KeyDeps = BaseDeps & {
  addItem: (item: InventoryItem) => void;
  gotKey?: boolean;
  setGotKey?: React.Dispatch<React.SetStateAction<boolean>>;
};

export type QuestDeps = {
  progressQuest: (id: QuestId, step: number) => void;
};