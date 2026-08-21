import type {
  EquippedItemInfo,
  EquippedItems,
  EquipmentRank,
} from "@/utils/types/player/equipment";
import { ARMOR_SLOTS } from "@/data/equipment/definitions";
import { getEquipmentById } from "@/data/equipment";
import { loadEquipped } from "@/data/equipment/storage";
import { equipmentSeed } from "./enhance";
import { RANK_INDEX } from "./stats";

export type EquipmentResistances = {
  heat: boolean;
  cold: boolean;
  blind: boolean;
};

export const HEAT_RESISTANCE_LABEL = "Resistência a Calor";
export const COLD_RESISTANCE_LABEL = "Resistência a Frio";
export const BLIND_RESISTANCE_LABEL = "Redução de Cegueira";

export const RESISTANCE_DROP_CHANCE = 0.2;
export const RESISTANCE_REDUCTION_PER_PIECE_PCT = 10;
export const MIN_RESISTANCE_RANK: EquipmentRank = 5;

function isEpicOrHigher(rank: EquipmentRank): boolean {
  return RANK_INDEX[rank] >= RANK_INDEX[MIN_RESISTANCE_RANK];
}

function advanceSeed(seed: number, steps: number): number {
  let s = seed;
  for (let i = 0; i < steps; i++) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
  }
  return s;
}

export function getItemResistances(
  itemId: EquipmentId,
  enhance: number,
): EquipmentResistances {
  const item = getEquipmentById(itemId);
  if (!item) return { heat: false, cold: false, blind: false };
  if (!(ARMOR_SLOTS as readonly string[]).includes(item.slot))
    return { heat: false, cold: false, blind: false };
  if (!isEpicOrHigher(item.rank)) return { heat: false, cold: false, blind: false };

  let seed = advanceSeed(equipmentSeed(itemId), enhance);

  const heat = seed % 100 < RESISTANCE_DROP_CHANCE * 100;
  seed = advanceSeed(seed, 1);
  const cold = seed % 100 < RESISTANCE_DROP_CHANCE * 100;
  seed = advanceSeed(seed, 1);
  const blind = item.slot === "helmet" && seed % 100 < RESISTANCE_DROP_CHANCE * 100;

  return { heat, cold, blind };
}

function* eachArmorItem(
  equipped: EquippedItems,
): Generator<EquippedItemInfo> {
  for (const slot of ARMOR_SLOTS) {
    const info = equipped[slot];
    if (info) yield info;
  }
  yield* equipped.accessories;
}

export function getEquippedResistances(character: CharacterId): {
  heat: number;
  cold: number;
  blind: number;
} {
  const equipped = loadEquipped(character);
  let heat = 0;
  let cold = 0;
  let blind = 0;

  for (const info of eachArmorItem(equipped)) {
    const res = getItemResistances(info.id, info.enhance);
    if (res.heat) heat += RESISTANCE_REDUCTION_PER_PIECE_PCT;
    if (res.cold) cold += RESISTANCE_REDUCTION_PER_PIECE_PCT;
    if (res.blind) blind += RESISTANCE_REDUCTION_PER_PIECE_PCT;
  }

  return {
    heat: Math.min(100, heat),
    cold: Math.min(100, cold),
    blind: Math.min(100, blind),
  };
}

export function reduceDurationByResistance(
  baseMs: number,
  resistancePct: number,
): number {
  return Math.round(baseMs * (1 - resistancePct / 100));
}

export function reduceTickDamage(
  base: number,
  resistancePct: number,
): number {
  return Math.max(1, Math.round(base * (1 - resistancePct / 100)));
}
