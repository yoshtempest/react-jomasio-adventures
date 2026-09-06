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
  contents: LootBagContents;
  state: "open" | "beingDragged";
};