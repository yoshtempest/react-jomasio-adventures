import { loadEquipped } from "@/data/equipment/storage";
import { getActiveSetItemIds } from "../sets";
import { eachEquippedItem } from "./eachEquippedItem";
import { addItemBonus } from "./addItemBonus";
import type { EquipmentBonus } from "@/utils/types/player/equipment";


export function getEquipmentStatsBonus(character: CharacterId): EquipmentBonus {
  const equipped = loadEquipped(character);
  const setItemIds = getActiveSetItemIds(character);
  const bonus: EquipmentBonus = {
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
    addItemBonus(bonus, info, setItemIds);
  }

  return bonus;
}