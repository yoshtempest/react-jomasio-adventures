import type {
  EquippedItems,
  EquipmentRank,
  EquipmentSlot,
} from "@/utils/types/player/equipment";

export const EQUIPMENT_SLOTS = [
  "weapon",
  "helmet",
  "chestplate",
  "pants",
  "boots",
  "accessory",
  "bag",
  "pet",
] as const;

export const ARMOR_SLOTS = [
  "helmet",
  "chestplate",
  "pants",
  "boots",
  "accessory",
] as const;

export const EQUIPMENT_RANKS = [
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
] as const satisfies readonly EquipmentRank[];

export const RANK_INDEX: Record<EquipmentRank, number> = {
  1: 0,
  2: 1,
  3: 2,
  4: 3,
  5: 4,
  6: 5,
  7: 6,
  8: 7,
  9: 8,
  0: 9,
  EX: 10,
};

export const MAX_ACCESSORIES = 9;
export const ACCESSORY_UNLOCKED_COUNT = 1;

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
  1: "Errante",
  2: "Iniciado",
  3: "Adepto",
  4: "Ascendente",
  5: "Veterano",
  6: "Elite",
  7: "Lendário",
  8: "Mítico",
  9: "Celestial",
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

export const WEAPON_CRIT_RATE: Record<EquipmentRank, number> = {
  1: 1,
  2: 2,
  3: 3,
  4: 5,
  5: 7,
  6: 10,
  7: 13,
  8: 16,
  9: 20,
  0: 25,
  EX: 30,
};