import { getEquipmentById } from "@/data/equipment";
import { loadEquipped } from "@/data/equipment/storage";
import { halfHealReductionForRank } from "@/gameRules/battle/equipment/stats/halfHealReductionForRank";
import { FIVE_THOUSAND_MS } from "@/data/ms";


export const HALFHEAL_DURATION_MS =  FIVE_THOUSAND_MS

export function getHalfHealReduction(character: CharacterId): number {
  const equipped = loadEquipped(character);
  let best = 0;
  if (equipped.weapon) {
    const item = getEquipmentById(equipped.weapon.id);
    if (item) best = Math.max(best, halfHealReductionForRank(item.rank));
  }
  if (equipped.chestplate) {
    const item = getEquipmentById(equipped.chestplate.id);
    if (item) best = Math.max(best, halfHealReductionForRank(item.rank));
  }
  return best;
}
