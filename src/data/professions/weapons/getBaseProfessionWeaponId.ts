import { PROFESSION_WEAPONS } from "./constants";
import { PROFESSION_WEAPON_TIERS } from "./constants";
import { getProfessionWeaponId } from "./getProfessionWeaponId";

/** Se `weaponId` é uma arma de profissão evoluída, retorna o id base (comum). */
export function getBaseProfessionWeaponId(weaponId: string): string | null {
  for (const config of Object.values(PROFESSION_WEAPONS)) {
    if (weaponId === config.baseToolId) return config.baseToolId;
    for (const tier of PROFESSION_WEAPON_TIERS) {
      if (weaponId === getProfessionWeaponId(config, tier.id))
        return config.baseToolId;
    }
  }
  return null;
}
