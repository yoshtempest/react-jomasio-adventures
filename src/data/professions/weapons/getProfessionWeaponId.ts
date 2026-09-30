import { TIER_SUFFIX } from "./constants";
import type { ProfessionWeaponConfig } from "./types";
import type { ProfessionWeaponTierId } from "./types";

/** Arma (EquipmentId) de uma profissão num dado ranque. */
export function getProfessionWeaponId(
  config: ProfessionWeaponConfig,
  tier: ProfessionWeaponTierId,
): EquipmentId {
  if (tier === "comum") return config.baseToolId;
  return `${config.baseToolId}_${TIER_SUFFIX[tier]}`;
}
