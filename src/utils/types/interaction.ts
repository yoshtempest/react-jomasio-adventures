export type BaseDeps = {
  setPopup: (msg: string) => void;
};

export type InventoryDeps = BaseDeps & {
  hasItem: (id: string) => boolean;
  addItem: (item: { id: string; name: string }) => void;
  removeItem: (id: string) => void;
  navigate?: (path: string) => void;
};

export type KeyDeps = BaseDeps & {
  addItem: (item: { id: string; name: string }) => void;
  gotKey?: boolean;
  setGotKey?: (value: boolean) => void;
};

export type QuestDeps = {
  progressQuest: (id: string, step: number) => void;
};