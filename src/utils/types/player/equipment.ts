export type EquipmentSlot =
  | "weapon"
  | "helmet"
  | "chestplate"
  | "pants"
  | "boots"
  | "accessory"
  | "bag"
  | "pet";

export type EquipmentRank = NPCClass;

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
  "common",
  "rare",
  "epic",
  "boss",
  "legendary",
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
};

export type EquippedItemInfo = {
  id: EquipmentId;
  enhance: number;
};

export type EquippedItems = {
  [K in EquipmentSlot]: EquippedItemInfo | null;
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
  };
}

export const RANK_LABELS: Record<EquipmentRank, string> = {
  common: "Comum",
  rare: "Raro",
  epic: "Épico",
  boss: "Chefão",
  legendary: "Lendário",
};

export const RANK_COLORS: Record<EquipmentRank, string> = {
  common: "#9d9d9d",
  rare: "#4a9eff",
  epic: "#b44aff",
  boss: "#dd0808",
  legendary: "#ff8c00",
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
