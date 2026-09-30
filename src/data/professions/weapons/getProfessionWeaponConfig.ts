import { PROFESSION_WEAPONS } from "./constants";
import { PROFESSION_WEAPON_TIERS } from "./constants";
import { getProfessionWeaponId } from "./getProfessionWeaponId";
import type { ProfessionWeaponConfig } from "./types";

/** Retorna o config de profissão cuja arma (em qualquer ranque) é `weaponId`. */
export function getProfessionWeaponConfig(
  weaponId: string,
): ProfessionWeaponConfig | undefined {
  for (const config of Object.values(PROFESSION_WEAPONS)) {
    if (weaponId === config.baseToolId) return config;
    for (const tier of PROFESSION_WEAPON_TIERS) {
      if (weaponId === getProfessionWeaponId(config, tier.id)) return config;
    }
  }
  return undefined;
}
