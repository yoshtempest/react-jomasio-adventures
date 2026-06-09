import type { EquippedItems } from "@/utils/types/player/equipment";
import { createEmptyEquipped } from "@/utils/types/player/equipment";
import { getEquipmentById } from "@/data/equipment";

const EQUIP_KEY = "jomasio_equipment";

function loadEquipped(): EquippedItems {
  try {
    const raw = localStorage.getItem(EQUIP_KEY);
    if (!raw) return createEmptyEquipped();
    const parsed = JSON.parse(raw);
    return { ...createEmptyEquipped(), ...parsed.equipped };
  } catch {
    return createEmptyEquipped();
  }
}

export function getEquipmentStatsBonus(): { hp: number; strength: number; intelligence: number } {
  const equipped = loadEquipped();
  const bonus = { hp: 0, strength: 0, intelligence: 0 };

  for (const slot of Object.keys(equipped) as (keyof EquippedItems)[]) {
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
