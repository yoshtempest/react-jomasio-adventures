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

export type PickupDeps = BaseDeps & {
  addItem: (item: InventoryItem) => void;
  gotKey?: boolean;
  setFlag?: (flag: FlagId) => void;
};

export type QuestDeps = {
  progressQuest: (id: QuestId, step: number) => void;
};

export type PickupHandlerConfig = {
  item: InventoryItem;
  flagId: FlagId;
  pickupMessage: string;
  alreadyPickedMessage?: string;
  questProgress?: { id: QuestId; step: number };
};

export type ExchangeHandlerConfig = {
  coord: string;
  requiredItem: ItemId;
  item: InventoryItem;
  successMessage: string;
};
