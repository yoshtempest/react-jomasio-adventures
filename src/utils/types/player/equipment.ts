export type EquipmentSlot = "helmet" | "chestplate" | "pants" | "boots";

export type EquipmentRank = "common" | "rare" | "epic" | "boss" | "legendary";

export const EQUIPMENT_SLOTS: EquipmentSlot[] = ["helmet", "chestplate", "pants", "boots"];

export const EQUIPMENT_RANKS: EquipmentRank[] = ["common", "rare", "epic", "boss", "legendary"];

export type Equipment = {
  id: EquipmentId;
  name: string;
  slot: EquipmentSlot;
  rank: EquipmentRank;
  stats: {
    hp: number;
    strength: number;
    intelligence: number;
  };
};

export type EquippedItems = {
  [K in EquipmentSlot]: EquipmentId | null;
};

export function createEmptyEquipped(): EquippedItems {
  return {
    helmet: null,
    chestplate: null,
    pants: null,
    boots: null,
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
  helmet: "Elmo",
  chestplate: "Peitoral",
  pants: "Calças",
  boots: "Botas",
};
