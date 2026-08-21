import type { Equipment, EquipmentRank } from "@/utils/types/player/equipment";
import type { EquipmentSlot } from "@/utils/types/player/equipment";

import { ACCESSORIES } from "./accessories";
import { BAGS } from "./bags";
import { BOOTS } from "./boots";
import { CHESTPLATES } from "./chestplates";
import { HELMETS } from "./helmets";
import { PANTS } from "./pants";
import { PETS } from "./pets";
import { WEAPONS } from "./weapons";

const EQUIPMENT_DB = [
  ...WEAPONS,
  ...HELMETS,
  ...CHESTPLATES,
  ...PANTS,
  ...BOOTS,
  ...ACCESSORIES,
  ...BAGS,
  ...PETS,
] as const;

/** Union fechada de todos os ids de equipamento — derivada dos dados. */
export type EquipmentId = (typeof EQUIPMENT_DB)[number]["id"];

export const EQUIPMENT_LIST = EQUIPMENT_DB;

export function isEquipmentId(value: string): value is EquipmentId {
  return EQUIPMENT_DB.some((e) => e.id === value);
}

export function getEquipmentById(id: string): Equipment | undefined {
  if (!isEquipmentId(id)) return undefined;
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
