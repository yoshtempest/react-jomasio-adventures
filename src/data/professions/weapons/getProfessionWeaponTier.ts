import { PROFESSION_WEAPONS } from "./constants";
import { PROFESSION_WEAPON_TIERS } from "./constants";
import { getProfessionWeaponId } from "./getProfessionWeaponId";
import type { ProfessionWeaponTierId } from "./types";

/** Identifica o ranque de uma arma de profissão (0..4). Retorna null se não for arma de profissão. */
export function getProfessionWeaponTier(
  weaponId: string,
): ProfessionWeaponTierId | null {
  for (const config of Object.values(PROFESSION_WEAPONS)) {
    for (const tier of PROFESSION_WEAPON_TIERS) {
      if (weaponId === getProfessionWeaponId(config, tier.id)) return tier.id;
    }
  }
  return null;
}
