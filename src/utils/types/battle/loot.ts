export type LootBagContents = {
  coins: number;
  hyperCoins: number;
  itemDrops: ItemDropInfo[];
  equipmentDrops: EquipmentDropInfo[];
  chestDrop: { id: ItemId; name: string } | null;
  keyDrop: { id: ItemId; name: string } | null;
};

export type BattleLootBag = {
  id: number;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  dropStartX: number;
  dropStartY: number;
  dropStartAt: number;
  dropDuration: number;
  contents: LootBagContents;
  state: "open" | "beingDragged";
};

export type LootNotifyEntry = {
  icon: string;
  qty: number;
  name: string;
};

export type LootNotification = {
  id: number;
  x: number;
  y: number;
  entries: LootNotifyEntry[];
};
