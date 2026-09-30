import { PROFESSION_WEAPON_TIERS } from "./constants";
import type { ProfessionWeaponTierId } from "./types";

/** Tier (indice 0..4) do ranque de uma arma de profissão. */
export function getTierIndex(tier: ProfessionWeaponTierId): number {
  return PROFESSION_WEAPON_TIERS.findIndex((t) => t.id === tier);
}
