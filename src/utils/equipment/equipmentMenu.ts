import type { Equipment } from "@/utils/types/player/equipment";

export type EquipmentMenuItem =
  | {
      type: "slot";
      slot: EquipmentSlot;
      item: Equipment | null;
    }
  | {
      type: "collected";
      item: Equipment;
      qty: number;
    };

export const EQUIPPED_COUNT = 16;
export const FILTER_TAB_COUNT = 9;
export const FILTER_TABS = [
  "all",
  "weapon",
  "helmet",
  "chestplate",
  "pants",
  "boots",
  "accessory",
  "bag",
  "pet",
] as const;

export type EquipmentFilter = (typeof FILTER_TABS)[number];

export const FILTER_LABELS: Record<EquipmentFilter, string> = {
  all: "/assets/equipments/all.svg",
  weapon: "/assets/equipments/weapons.svg",
  helmet: "/assets/equipments/helmet.svg",
  chestplate: "/assets/equipments/chestplate.svg",
  pants: "/assets/equipments/pants.svg",
  boots: "/assets/equipments/boots.svg",
  accessory: "/assets/equipments/acessorys.svg",
  bag: "/assets/equipments/bags.svg",
  pet: "/assets/equipments/pets.svg",
};
