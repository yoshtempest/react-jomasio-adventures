import type {
  EquippedItems,
  EquippedItemInfo,
  EquipmentStats,
  EquipmentSlot,
} from "@/utils/types/player/equipment";
import {
  createEmptyEquipped,
  EQUIPMENT_SLOTS,
  ARMOR_SLOTS,
} from "@/utils/types/player/equipment";
import { getEquipmentById } from "@/data/equipment";

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

const MIN_SET_PIECES = 3;

export const SET_MULTIPLIER = 1.5;

const EQUIP_KEY = "jomasio_equipment";

function loadEquipped(character: CharacterId): EquippedItems {
  try {
    const raw = localStorage.getItem(EQUIP_KEY);
    if (!raw) return createEmptyEquipped();
    const all = JSON.parse(raw);
    const data = all[character];
    if (!data) return createEmptyEquipped();
    const rawEquipped = data.equipped ?? {};
    const result = createEmptyEquipped();
    for (const slot of EQUIPMENT_SLOTS) {
      const val = rawEquipped[slot];
      if (!val) {
        result[slot] = null;
      } else if (typeof val === "string") {
        result[slot] = { id: val, enhance: 0 };
      } else {
        result[slot] = { id: val.id ?? val, enhance: val.enhance ?? 0 };
      }
    }
    if (Array.isArray(rawEquipped.accessories)) {
      result.accessories = rawEquipped.accessories.map(
        (a: unknown) => {
          if (!a) return null;
          if (typeof a === "string") return { id: a, enhance: 0 };
          const obj = a as Record<string, unknown>;
          return { id: String(obj.id ?? ""), enhance: Number(obj.enhance ?? 0) };
        },
      ).filter((a: EquippedItemInfo | null): a is EquippedItemInfo => a !== null && a.id !== "");
    }
    return result;
  } catch {
    return createEmptyEquipped();
  }
}

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

export function getActiveSetItemIds(character: CharacterId): Set<string> {
  const equipped = loadEquipped(character);
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

  const activeIds = new Set<string>();
  for (const ids of Object.values(setPieces)) {
    if (ids.length >= MIN_SET_PIECES) {
      for (const id of ids) activeIds.add(id);
    }
  }
  return activeIds;
}

export function getSetMultiplier(
  character: CharacterId,
  itemId: string,
): number {
  const definedItem = getEquipmentById(itemId);
  if (!definedItem?.set) return 1;

  const equipped = loadEquipped(character);
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

  const ids = setPieces[definedItem.set];
  if (!ids || ids.length < MIN_SET_PIECES) return 1;
  return SET_MULTIPLIER;
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
  let total = resistance !== undefined ? getResistanceArmor(resistance) : 0;

  for (const slot of ARMOR_SLOTS) {
    const info = equipped[slot];
    if (!info) continue;
    const stats = getEffectiveStats(info.id, info.enhance);
    const multiplier = setItemIds.has(info.id) ? SET_MULTIPLIER : 1;
    total += Math.round(stats.armor * multiplier);
  }

  return total;
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
  let total = 0;

  for (const slot of EQUIPMENT_SLOTS) {
    const info = equipped[slot];
    if (!info) continue;
    const stats = getEffectiveStats(info.id, info.enhance);
    const multiplier = setItemIds.has(info.id) ? SET_MULTIPLIER : 1;
    total += Math.round(stats.shield * multiplier);
  }

  for (const info of equipped.accessories) {
    const stats = getEffectiveStats(info.id, info.enhance);
    const multiplier = setItemIds.has(info.id) ? SET_MULTIPLIER : 1;
    total += Math.round(stats.shield * multiplier);
  }

  return total;
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

  for (const slot of EQUIPMENT_SLOTS) {
    const info = equipped[slot];
    if (!info) continue;
    const stats = getEffectiveStats(info.id, info.enhance);
    const multiplier = setItemIds.has(info.id) ? SET_MULTIPLIER : 1;
    bonus.hp += Math.round(stats.hp * multiplier);
    bonus.strength += Math.round(stats.strength * multiplier);
    bonus.intelligence += Math.round(stats.intelligence * multiplier);
    bonus.shield += Math.round(stats.shield * multiplier);
    bonus.vampirism += Math.round(stats.vampirism * multiplier);
    bonus.reflect += Math.round(stats.reflect * multiplier);
  }

  for (const info of equipped.accessories) {
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
  let total = 0;

  for (const slot of EQUIPMENT_SLOTS) {
    const info = equipped[slot];
    if (!info) continue;
    const stats = getEffectiveStats(info.id, info.enhance);
    const multiplier = setItemIds.has(info.id) ? SET_MULTIPLIER : 1;
    total += Math.round(stats.vampirism * multiplier);
  }

  for (const info of equipped.accessories) {
    const stats = getEffectiveStats(info.id, info.enhance);
    const multiplier = setItemIds.has(info.id) ? SET_MULTIPLIER : 1;
    total += Math.round(stats.vampirism * multiplier);
  }

  return total;
}

export function getTotalReflect(character: CharacterId): number {
  const equipped = loadEquipped(character);
  const setItemIds = getActiveSetItemIds(character);
  let total = 0;

  for (const slot of EQUIPMENT_SLOTS) {
    const info = equipped[slot];
    if (!info) continue;
    const stats = getEffectiveStats(info.id, info.enhance);
    const multiplier = setItemIds.has(info.id) ? SET_MULTIPLIER : 1;
    total += Math.round(stats.reflect * multiplier);
  }

  for (const info of equipped.accessories) {
    const stats = getEffectiveStats(info.id, info.enhance);
    const multiplier = setItemIds.has(info.id) ? SET_MULTIPLIER : 1;
    total += Math.round(stats.reflect * multiplier);
  }

  return total;
}
