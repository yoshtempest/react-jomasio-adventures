import { loadEquipped } from "@/data/equipment/storage";
import { eachArmorItem } from "./eachArmorItem";
import { getItemResistances } from "./getItemResistances";
import { RESISTANCE_REDUCTION_PER_PIECE_PCT } from "@/data/equipment/statResistance";


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