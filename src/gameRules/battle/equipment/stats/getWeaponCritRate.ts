import { getEquipmentById } from "@/data/equipment";
import { loadEquipped } from "@/data/equipment/storage";
import { WEAPON_CRIT_RATE } from "@/data/equipment/definitions";

export function getWeaponCritRate(character: CharacterId): number {
  const equipped = loadEquipped(character);
  const info = equipped.weapon;
  if (!info) return 0;
  const weapon = getEquipmentById(info.id);
  if (!weapon) return 0;
  return WEAPON_CRIT_RATE[weapon.rank] ?? 0;
}