import type {
  EquippedItems,
  EquipmentStats,
} from "@/utils/types/player/equipment";
import { eachEquippedItem } from "./eachEquippedItem";
import { getEffectiveStats } from "@/gameRules/battle/equipment/enhance";
import { SET_MULTIPLIER } from "@/gameRules/battle/equipment/sets";

export function sumEquippedStat(
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
