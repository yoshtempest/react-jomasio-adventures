import {
  HEAT_RESISTANCE_LABEL,
  COLD_RESISTANCE_LABEL,
  BLIND_RESISTANCE_LABEL,
  RESISTANCE_DROP_CHANCE,
  RESISTANCE_REDUCTION_PER_PIECE_PCT
} from "@/data/equipment/statResistance";
import type { EquipmentResistances } from "./resistances/getItemResistances";

export { getEnhanceBonus, getEffectiveStats, equipmentSeed } from "./enhance";

export {
  SET_SLOTS,
  SET_MULTIPLIER,
  buildSetItemIds,
  getActiveSetItemIds,
  getSetMultiplier,
} from "./sets";

export {
  getWeaponCritRate,
  getResistanceArmor,
  getTotalArmor,
  getBlockLimit,
  getTotalShield,
  getEquipmentStatsBonus,
  getTotalVampirism,
  getTotalReflect,
  addItemBonus,
  getHalfHealReduction,
  HALFHEAL_DURATION_MS,
  RANK_INDEX,
} from "./stats";

export {
  getItemResistances,
  getEquippedResistances,
  reduceDurationByResistance,
  reduceTickDamage,
} from "./resistances";

export {
  HEAT_RESISTANCE_LABEL,
  COLD_RESISTANCE_LABEL,
  BLIND_RESISTANCE_LABEL,
  RESISTANCE_DROP_CHANCE,
  RESISTANCE_REDUCTION_PER_PIECE_PCT,
  type EquipmentResistances,
}
