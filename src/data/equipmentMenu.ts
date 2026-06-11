import type { Equipment, EquipmentSlot } from "@/utils/types/player/equipment";

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

export const EQUIPPED_COUNT = 7;
export const FILTER_TAB_COUNT = 8;
export const FILTER_TABS = ["all", "helmet", "chestplate", "pants", "boots", "accessory", "bag", "pet"] as const;

export type EquipmentFilter = (typeof FILTER_TABS)[number];

export const FILTER_LABELS: Record<EquipmentFilter, string> = {
  all: "Todos",
  helmet: "Elmos",
  chestplate: "Peitorais",
  pants: "Calças",
  boots: "Botas",
  accessory: "Acessórios",
  bag: "Bolsas",
  pet: "Pets",
};
