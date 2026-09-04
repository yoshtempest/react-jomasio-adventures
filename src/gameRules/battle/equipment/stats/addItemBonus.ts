import type { EquipmentBonus, EquippedItemInfo } from "@/utils/types/player/equipment";
import { getEffectiveStats } from "../enhance";
import { SET_MULTIPLIER } from "../sets";

export function addItemBonus(
  bonus: EquipmentBonus,
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
  bonus.tenacity += Math.round((stats.tenacity ?? 0) * multiplier);
  bonus.luck += Math.round((stats.luck ?? 0) * multiplier);
  bonus.maxHpDamage += Math.round((stats.maxHpDamage ?? 0) * multiplier);
  bonus.trueDamage += Math.round((stats.trueDamage ?? 0) * multiplier);
}