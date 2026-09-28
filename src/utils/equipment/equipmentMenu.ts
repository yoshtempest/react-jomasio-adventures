import { equipmentIconPath } from "@/utils/paths";

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
  all: equipmentIconPath("all.svg"),
  weapon: equipmentIconPath("weapons.svg"),
  helmet: equipmentIconPath("helmet.svg"),
  chestplate: equipmentIconPath("chestplate.svg"),
  pants: equipmentIconPath("pants.svg"),
  boots: equipmentIconPath("boots.svg"),
  accessory: equipmentIconPath("acessorys.svg"),
  bag: equipmentIconPath("bags.svg"),
  pet: equipmentIconPath("pets.svg"),
};

/** Ícone do slot de equipamento (não do item em si). */
export const SLOT_ICONS: Record<EquipmentSlot, string> = {
  weapon: FILTER_LABELS.weapon,
  helmet: FILTER_LABELS.helmet,
  chestplate: FILTER_LABELS.chestplate,
  pants: FILTER_LABELS.pants,
  boots: FILTER_LABELS.boots,
  accessory: FILTER_LABELS.accessory,
  bag: FILTER_LABELS.bag,
  pet: FILTER_LABELS.pet,
};
