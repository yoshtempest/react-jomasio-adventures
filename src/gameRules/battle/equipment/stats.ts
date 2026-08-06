import type {
  EquippedItems,
  EquippedItemInfo,
  EquipmentStats,
  EquipmentRank,
} from "@/utils/types/player/equipment";
import { EQUIPMENT_SLOTS } from "@/utils/types/player/equipment";
import { getEquipmentById } from "@/data/equipment";
import { loadEquipped } from "@/data/equipment/storage";
import { getEffectiveStats } from "./enhance";
import { getActiveSetItemIds, SET_MULTIPLIER } from "./sets";

const WEAPON_CRIT_RATE: Record<EquipmentRank, number> = {
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

function* eachEquippedItem(
  equipped: EquippedItems,
): Generator<EquippedItemInfo> {
  for (const slot of EQUIPMENT_SLOTS) {
    const info = equipped[slot];
    if (info) yield info;
  }
  yield* equipped.accessories;
}

function sumEquippedStat(
  equipped: EquippedItems,
  stat: keyof EquipmentStats,
  setItemIds: Set<string>,
): number {
  let total = 0;
  for (const info of eachEquippedItem(equipped)) {
    const stats = getEffectiveStats(info.id, info.enhance);
    const multiplier = setItemIds.has(info.id) ? SET_MULTIPLIER : 1;
    total += Math.round((stats[stat] ?? 0) * multiplier);
  }
  return total;
}

export function getWeaponCritRate(character: CharacterId): number {
  const equipped = loadEquipped(character);
  const info = equipped.weapon;
  if (!info) return 0;
  const weapon = getEquipmentById(info.id);
  if (!weapon) return 0;
  return WEAPON_CRIT_RATE[weapon.rank] ?? 0;
}

export function getResistanceArmor(resistance: number): number {
  return resistance * 2;
}

export function getTotalArmor(
  character: CharacterId,
  resistance?: number,
): number {
  const equipped = loadEquipped(character);
  const setItemIds = getActiveSetItemIds(character);
  const base = resistance !== undefined ? getResistanceArmor(resistance) : 0;
  return base + sumEquippedStat(equipped, "armor", setItemIds);
}

export function getBlockLimit(level: number, totalArmor: number): number {
  return 20 + level * 3 + totalArmor * 2;
}

export function getTotalShield(character: CharacterId): number {
  const equipped = loadEquipped(character);
  const setItemIds = getActiveSetItemIds(character);
  return sumEquippedStat(equipped, "shield", setItemIds);
}

export function getEquipmentStatsBonus(character: CharacterId): {
  hp: number;
  strength: number;
  intelligence: number;
  shield: number;
  vampirism: number;
  reflect: number;
  tenacity: number;
  luck: number;
  maxHpDamage: number;
  trueDamage: number;
} {
  const equipped = loadEquipped(character);
  const setItemIds = getActiveSetItemIds(character);
  const bonus = {
    hp: 0,
    strength: 0,
    intelligence: 0,
    shield: 0,
    vampirism: 0,
    reflect: 0,
    tenacity: 0,
    luck: 0,
    maxHpDamage: 0,
    trueDamage: 0,
  };

  for (const info of eachEquippedItem(equipped)) {
    const stats = getEffectiveStats(info.id, info.enhance);
    const multiplier = setItemIds.has(info.id) ? SET_MULTIPLIER : 1;
    bonus.hp += Math.round(stats.hp * multiplier);
    bonus.strength += Math.round(stats.strength * multiplier);
    bonus.intelligence += Math.round(stats.intelligence * multiplier);
    bonus.shield += Math.round(stats.shield * multiplier);
    bonus.vampirism += Math.round(stats.vampirism * multiplier);
    bonus.reflect += Math.round(stats.reflect * multiplier);
    bonus.tenacity += Math.round((stats.tenacity ?? 0) * multiplier);
    bonus.luck += Math.round((stats.luck ?? 0) * multiplier);
    bonus.maxHpDamage += Math.round((stats.maxHpDamage ?? 0) * multiplier);
    bonus.trueDamage += Math.round((stats.trueDamage ?? 0) * multiplier);
  }

  return bonus;
}

export function getTotalVampirism(character: CharacterId): number {
  const equipped = loadEquipped(character);
  const setItemIds = getActiveSetItemIds(character);
  return sumEquippedStat(equipped, "vampirism", setItemIds);
}

export function getTotalReflect(character: CharacterId): number {
  const equipped = loadEquipped(character);
  const setItemIds = getActiveSetItemIds(character);
  return sumEquippedStat(equipped, "reflect", setItemIds);
}

export function addItemBonus(
  bonus: {
    hp: number;
    strength: number;
    intelligence: number;
    shield: number;
    vampirism: number;
    reflect: number;
    tenacity: number;
    luck: number;
    maxHpDamage: number;
    trueDamage: number;
  },
  info: EquippedItemInfo,
  setItemIds: Set<string>,
) {
  const stats = getEffectiveStats(info.id, info.enhance);
  const multiplier = setItemIds.has(info.id) ? SET_MULTIPLIER : 1;
  bonus.hp += Math.round(stats.hp * multiplier);
  bonus.strength += Math.round(stats.strength * multiplier);
  bonus.intelligence += Math.round(stats.intelligence * multiplier);
  bonus.shield += Math.round(stats.shield * multiplier);
  bonus.vampirism += Math.round(stats.vampirism * multiplier);
  bonus.reflect += Math.round(stats.reflect * multiplier);
  bonus.tenacity += Math.round((stats.tenacity ?? 0) * multiplier);
  bonus.luck += Math.round((stats.luck ?? 0) * multiplier);
  bonus.maxHpDamage += Math.round((stats.maxHpDamage ?? 0) * multiplier);
  bonus.trueDamage += Math.round((stats.trueDamage ?? 0) * multiplier);
}

export const RANK_INDEX: Record<EquipmentRank, number> = {
  1: 0, 2: 1, 3: 2, 4: 3, 5: 4, 6: 5, 7: 6, 8: 7, 9: 8, 0: 9, EX: 10,
};

function cortaCuraReductionForRank(rank: EquipmentRank): number {
  const idx = RANK_INDEX[rank];
  if (idx < 4) return 0;
  return Math.round(((idx - 4) / 6) * 40);
}

export const CORATACURA_DURATION_MS = 5000;

export function getCortaCuraReduction(character: CharacterId): number {
  const equipped = loadEquipped(character);
  let best = 0;
  if (equipped.weapon) {
    const item = getEquipmentById(equipped.weapon.id);
    if (item) best = Math.max(best, cortaCuraReductionForRank(item.rank));
  }
  if (equipped.chestplate) {
    const item = getEquipmentById(equipped.chestplate.id);
    if (item) best = Math.max(best, cortaCuraReductionForRank(item.rank));
  }
  return best;
}
