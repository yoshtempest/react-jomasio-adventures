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

/**
 * Índice por id: `getEquipmentById` é consultado no hot path de batalha
 * (`mana`, conjuntos de equipamento) e antes fazia **duas** varreduras lineares
 * por chamada (`isEquipmentId` + `find`). Um `Map` resolve em O(1) e mantém a
 * checagem de guarda de uma só vez.
 */
const EQUIPMENT_BY_ID = new Map<string, Equipment>(
  EQUIPMENT_DB.map(
    (entry): [string, Equipment] => [entry.id, entry as Equipment],
  ),
);

export function isEquipmentId(value: string): value is EquipmentId {
  return EQUIPMENT_BY_ID.has(value);
}

export function getEquipmentById(id: string): Equipment | undefined {
  return EQUIPMENT_BY_ID.get(id);
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
