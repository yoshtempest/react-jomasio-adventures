import type { EquippedItems, EquipmentRank } from "@/utils/types/player/equipment";
import { createEmptyEquipped, EQUIPMENT_SLOTS } from "@/utils/types/player/equipment";
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
    return { ...createEmptyEquipped(), ...data.equipped };
  } catch {
    return createEmptyEquipped();
  }
}

export function getWeaponCritRate(character: CharacterId): number {
  const equipped = loadEquipped(character);
  const weaponId = equipped.weapon;
  if (!weaponId) return 0;
  const weapon = getEquipmentById(weaponId);
  if (!weapon) return 0;
  return WEAPON_CRIT_RATE[weapon.rank] ?? 0;
}

export function getEquipmentStatsBonus(character: CharacterId): { hp: number; strength: number; intelligence: number } {
  const equipped = loadEquipped(character);
  const bonus = { hp: 0, strength: 0, intelligence: 0 };

  for (const slot of EQUIPMENT_SLOTS) {
    const id = equipped[slot];
    if (!id) continue;
    const item = getEquipmentById(id);
    if (!item) continue;
    bonus.hp += item.stats.hp;
    bonus.strength += item.stats.strength;
    bonus.intelligence += item.stats.intelligence;
  }

  return bonus;
}
