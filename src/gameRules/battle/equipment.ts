import type {
  EquippedItems,
  EquippedItemInfo,
  EquipmentStats,
} from "@/utils/types/player/equipment";
import { EQUIPMENT_SLOTS } from "@/utils/types/player/equipment";
import { getEquipmentById } from "@/data/equipment";
import { loadEquipped } from "@/data/equipment/storage";

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

export const SET_SLOTS: EquipmentSlot[] = [
  "weapon", "helmet", "chestplate", "pants", "boots", "accessory",
];

export const SET_MULTIPLIER = 1.5;

function getEnhanceBonus(itemId: string, enhance: number): EquipmentStats {
  const bonus: EquipmentStats = {
    hp: 0,
    strength: 0,
    intelligence: 0,
    armor: 0,
    shield: 0,
    vampirism: 0,
    reflect: 0,
  };
  if (enhance <= 0) return bonus;

  const item = getEquipmentById(itemId);
  if (!item) return bonus;

  const avail: (keyof EquipmentStats)[] = [];
  if ((item.stats.hp ?? 0) > 0) avail.push("hp");
  if ((item.stats.strength ?? 0) > 0) avail.push("strength");
  if ((item.stats.intelligence ?? 0) > 0) avail.push("intelligence");
  if ((item.stats.armor ?? 0) > 0) avail.push("armor");
  if ((item.stats.shield ?? 0) > 0) avail.push("shield");

  if (avail.length === 0) return bonus;

  let seed = 0;
  for (let i = 0; i < itemId.length; i++) {
    seed = ((seed << 5) - seed + itemId.charCodeAt(i)) | 0;
  }

  for (let i = 0; i < enhance; i++) {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    const idx = seed % avail.length;
    bonus[avail[idx]] += 1;
  }

  return bonus;
}

export function getEffectiveStats(
  itemId: string,
  enhance: number,
): EquipmentStats {
  const item = getEquipmentById(itemId);
  if (!item)
    return { hp: 0, strength: 0, intelligence: 0, armor: 0, shield: 0, vampirism: 0, reflect: 0 };
  const enhanceBonus = getEnhanceBonus(itemId, enhance);
  return {
    hp: (item.stats.hp ?? 0) + enhanceBonus.hp,
    strength: (item.stats.strength ?? 0) + enhanceBonus.strength,
    intelligence: (item.stats.intelligence ?? 0) + enhanceBonus.intelligence,
    armor: (item.stats.armor ?? 0) + enhanceBonus.armor,
    shield: (item.stats.shield ?? 0) + enhanceBonus.shield,
    vampirism: item.stats.vampirism ?? 0,
    reflect: item.stats.reflect ?? 0,
  };
}

function* eachEquippedItem(equipped: EquippedItems): Generator<EquippedItemInfo> {
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

export function buildSetItemIds(equipped: EquippedItems): Set<string> {
  const setPieces: Record<string, string[]> = {};

  for (const slot of SET_SLOTS) {
    const info = equipped[slot];
    if (!info) continue;
    const item = getEquipmentById(info.id);
    if (!item?.set) continue;
    if (!setPieces[item.set]) setPieces[item.set] = [];
    setPieces[item.set].push(info.id);
  }

  for (const info of equipped.accessories) {
    const item = getEquipmentById(info.id);
    if (!item?.set) continue;
    if (!setPieces[item.set]) setPieces[item.set] = [];
    setPieces[item.set].push(info.id);
  }

  const setItemIds = new Set<string>();
  for (const ids of Object.values(setPieces)) {
    if (ids.length >= 3) {
      for (const id of ids) setItemIds.add(id);
    }
  }

  return setItemIds;
}

export function getActiveSetItemIds(character: CharacterId): Set<string> {
  return buildSetItemIds(loadEquipped(character));
}

export function getSetMultiplier(
  character: CharacterId,
  itemId: string,
): number {
  const definedItem = getEquipmentById(itemId);
  if (!definedItem?.set) return 1;

  const setItemIds = getActiveSetItemIds(character);
  return setItemIds.has(itemId) ? SET_MULTIPLIER : 1;
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

export function getBlockLimit(
  level: number,
  totalArmor: number,
): number {
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
} {
  const equipped = loadEquipped(character);
  const setItemIds = getActiveSetItemIds(character);
  const bonus = { hp: 0, strength: 0, intelligence: 0, shield: 0, vampirism: 0, reflect: 0 };

  for (const info of eachEquippedItem(equipped)) {
    const stats = getEffectiveStats(info.id, info.enhance);
    const multiplier = setItemIds.has(info.id) ? SET_MULTIPLIER : 1;
    bonus.hp += Math.round(stats.hp * multiplier);
    bonus.strength += Math.round(stats.strength * multiplier);
    bonus.intelligence += Math.round(stats.intelligence * multiplier);
    bonus.shield += Math.round(stats.shield * multiplier);
    bonus.vampirism += Math.round(stats.vampirism * multiplier);
    bonus.reflect += Math.round(stats.reflect * multiplier);
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
}
