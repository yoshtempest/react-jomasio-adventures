export type EquipmentRank = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 0 | "EX";

export const EQUIPMENT_SLOTS: EquipmentSlot[] = [
  "weapon",
  "helmet",
  "chestplate",
  "pants",
  "boots",
  "accessory",
  "bag",
  "pet",
];

export const ARMOR_SLOTS: EquipmentSlot[] = [
  "helmet",
  "chestplate",
  "pants",
  "boots",
  "accessory",
];

export const EQUIPMENT_RANKS: EquipmentRank[] = [
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  0,
  "EX",
];

export const PET_EQUIPMENT_IDS = ["pet_goat"] as const;

export type PetEquipmentId = (typeof PET_EQUIPMENT_IDS)[number];

export type EquipmentStats = StatBlock;

export type Equipment = {
  id: EquipmentId;
  name: string;
  slot: EquipmentSlot;
  rank: EquipmentRank;
  stats: Partial<EquipmentStats>;
  bonusSlots?: number;
  set?: string;
  craftOnly?: boolean;
};

export type EquippedItemInfo = {
  id: EquipmentId;
  enhance: number;
};

export const MAX_ACCESSORIES = 9;
export const ACCESSORY_UNLOCKED_COUNT = 1;

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

export function createEmptyEquipped(): EquippedItems {
  return {
    weapon: null,
    helmet: null,
    chestplate: null,
    pants: null,
    boots: null,
    accessory: null,
    bag: null,
    pet: null,
    accessories: [],
  };
}

export const RANK_LABELS: Record<EquipmentRank, string> = {
  1: "Ferro",
  2: "Bronze",
  3: "Prata",
  4: "Ouro",
  5: "Platina",
  6: "Esmeralda",
  7: "Rubi",
  8: "Safira",
  9: "Diamante",
  0: "Transcendente",
  EX: "Divino",
};

export const RANK_COLORS: Record<EquipmentRank, string> = {
  1: "#9d9d9d",
  2: "#b87333",
  3: "#c0c0c0",
  4: "#ffd700",
  5: "#b44aff",
  6: "#50c878",
  7: "#e0115f",
  8: "#0f52ba",
  9: "#00ffff",
  0: "#ff6ec7",
  EX: "#ff4500",
};

export const SLOT_LABELS: Record<EquipmentSlot, string> = {
  weapon: "Arma",
  helmet: "Elmo",
  chestplate: "Peitoral",
  pants: "Calças",
  boots: "Botas",
  accessory: "Acessório",
  bag: "Bolsa",
  pet: "Pet",
};
