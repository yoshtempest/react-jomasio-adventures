import type {
  EquippedItems,
  EquipmentRank,
  EquipmentStats,
} from "@/utils/types/player/equipment";
import {
  createEmptyEquipped,
  EQUIPMENT_SLOTS,
  ARMOR_SLOTS,
} from "@/utils/types/player/equipment";
import { getEquipmentById } from "@/data/equipment";

const WEAPON_CRIT_RATE: Record<EquipmentRank, number> = {
  common: 1,
  rare: 3,
  epic: 7,
  boss: 13,
  legendary: 20,
};

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
  };
  if (enhance <= 0) return bonus;

  const item = getEquipmentById(itemId);
  if (!item) return bonus;

  const avail: (keyof EquipmentStats)[] = [];
  if (item.stats.hp > 0) avail.push("hp");
  if (item.stats.strength > 0) avail.push("strength");
  if (item.stats.intelligence > 0) avail.push("intelligence");
  if (item.stats.armor > 0) avail.push("armor");

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
  if (!item) return { hp: 0, strength: 0, intelligence: 0, armor: 0 };
  const enhanceBonus = getEnhanceBonus(itemId, enhance);
  return {
    hp: item.stats.hp + enhanceBonus.hp,
    strength: item.stats.strength + enhanceBonus.strength,
    intelligence: item.stats.intelligence + enhanceBonus.intelligence,
    armor: item.stats.armor + enhanceBonus.armor,
  };
}

export function getWeaponCritRate(character: CharacterId): number {
  const equipped = loadEquipped(character);
  const info = equipped.weapon;
  if (!info) return 0;
  const weapon = getEquipmentById(info.id);
  if (!weapon) return 0;
  return WEAPON_CRIT_RATE[weapon.rank] ?? 0;
}

export function getTotalArmor(character: CharacterId): number {
  const equipped = loadEquipped(character);
  let total = 0;

  for (const slot of ARMOR_SLOTS) {
    const info = equipped[slot];
    if (!info) continue;
    const stats = getEffectiveStats(info.id, info.enhance);
    total += stats.armor;
  }

  return total;
}

export function getEquipmentStatsBonus(character: CharacterId): {
  hp: number;
  strength: number;
  intelligence: number;
} {
  const equipped = loadEquipped(character);
  const bonus = { hp: 0, strength: 0, intelligence: 0 };

  for (const slot of EQUIPMENT_SLOTS) {
    const info = equipped[slot];
    if (!info) continue;
    const stats = getEffectiveStats(info.id, info.enhance);
    bonus.hp += stats.hp;
    bonus.strength += stats.strength;
    bonus.intelligence += stats.intelligence;
  }

  return bonus;
}
