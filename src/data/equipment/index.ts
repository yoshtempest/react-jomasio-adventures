import type { Equipment, EquipmentRank, EquipmentSlot } from "@/utils/types/player/equipment";

import { ACCESSORIES } from "./accessories";
import { BAGS } from "./bags";
import { BOOTS } from "./boots";
import { CHESTPLATES } from "./chestplates";
import { HELMETS } from "./helmets";
import { PANTS } from "./pants";
import { PETS } from "./pets";
import { WEAPONS } from "./weapons";

const EQUIPMENT_DB: Equipment[] = [
  ...WEAPONS,
  ...HELMETS,
  ...CHESTPLATES,
  ...PANTS,
  ...BOOTS,
  ...ACCESSORIES,
  ...BAGS,
  ...PETS,
];

export const EQUIPMENT_LIST: Equipment[] = EQUIPMENT_DB;

export function getEquipmentById(id: EquipmentId): Equipment | undefined {
  return EQUIPMENT_DB.find((e) => e.id === id);
}

export function getEquipmentBySlot(slot: EquipmentSlot): Equipment[] {
  return EQUIPMENT_DB.filter((e) => e.slot === slot);
}

export function getEquipmentByRank(rank: EquipmentRank): Equipment[] {
  return EQUIPMENT_DB.filter((e) => e.rank === rank);
}

export function getEquipmentBySlotAndRank(
  slot: EquipmentSlot,
  rank: EquipmentRank,
): Equipment[] {
  return EQUIPMENT_DB.filter((e) => e.slot === slot && e.rank === rank);
}
