export type EquipmentSlot =
  | "weapon"
  | "helmet"
  | "chestplate"
  | "pants"
  | "boots"
  | "accessory"
  | "bag"
  | "pet";

export type EquipmentRank = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 0 | "EX";

export type EquipmentStats = StatBlock;

export type EquipmentBonus = Omit<StatBlock, "armor">;

/**
 * Forma bruta usada pelos arquivos de dados em `src/data/equipment/`.
 * `id` é `string` aqui; a union fechada `EquipmentId` é derivada do
 * banco montado em `src/data/equipment/index.ts`.
 */
export type EquipmentDef = {
  id: string;
  name: string;
  slot: EquipmentSlot;
  rank: EquipmentRank;
  stats: Partial<EquipmentStats>;
  bonusSlots?: number;
  set?: string;
  craftOnly?: boolean;
};

export type Equipment = EquipmentDef & { id: EquipmentId };

export type EquippedItemInfo = {
  id: EquipmentId;
  enhance: number;
};

export type EquippedItems = {
  weapon: EquippedItemInfo | null;
  helmet: EquippedItemInfo | null;
  chestplate: EquippedItemInfo | null;
  pants: EquippedItemInfo | null;
  boots: EquippedItemInfo | null;
  bag: EquippedItemInfo | null;
  pet: EquippedItemInfo | null;
  accessory: EquippedItemInfo | null;
  accessories: EquippedItemInfo[];
};
