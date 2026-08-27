import type { ElementType } from "@/utils/types/battle/element";
import type { MaterialId } from "@/data/items/crafting";
import {
  getProfessionWeaponConfig,
  getProfessionWeaponTier,
  getBaseProfessionWeaponId,
  PROFESSION_WEAPON_TIERS,
  type ProfessionWeaponTierId,
} from "@/data/professions/weapons";

/**
 * Bônus de dano elemental de uma arma de profissão:
 *
 * `weaponId` → config da profissão (elemento-alvo) + ranque da arma.
 * Se o NPC tiver o elemento-alvo, retorna o multiplicador correspondente
 * (1 + damageBonus); caso contrário retorna 1 (sem bônus).
 */
export function getProfessionWeaponDamageMultiplier(
  weaponId: string,
  npcElementTypes: readonly ElementType[],
): number {
  const config = getProfessionWeaponConfig(weaponId);
  if (!config) return 1;

  if (!npcElementTypes.includes(config.element)) return 1;

  const tier = getProfessionWeaponTier(weaponId);
  const tierDef = tier
    ? PROFESSION_WEAPON_TIERS.find((t) => t.id === tier)
    : undefined;

  return 1 + (tierDef?.damageBonus ?? 0.05);
}

/** Retorna o ranque atual (tier id) da arma de profissão equipada, ou null. */
export function getEquippedProfessionTier(
  weaponId: string,
): ProfessionWeaponTierId | null {
  return getProfessionWeaponTier(weaponId);
}

/** Se a arma é de profissão, retorna o nome config (elemento) para exibição. */
export function getProfessionWeaponElementLabel(
  weaponId: string,
): { element: ElementType; tier: ProfessionWeaponTierId | null } | null {
  const config = getProfessionWeaponConfig(weaponId);
  if (!config) return null;
  const tier = getProfessionWeaponTier(weaponId);
  return { element: config.element, tier };
}

/** `true` se `weaponId` é uma arma evoluída do mesmo tipo base de `baseToolId`. */
export function isProfessionWeaponOf(
  weaponId: string,
  baseToolId: string,
): boolean {
  return getBaseProfessionWeaponId(weaponId) === baseToolId;
}

/** Chance de dropar o material da profissão conforme o ranque da arma equipada. */
export function getProfessionMaterialDropChance(weaponId: string): number {
  const config = getProfessionWeaponConfig(weaponId);
  if (!config) return 0;
  const tier = getProfessionWeaponTier(weaponId);
  const tierDef = tier
    ? PROFESSION_WEAPON_TIERS.find((t) => t.id === tier)
    : undefined;
  return tierDef?.materialDrop ?? 0.01;
}

/**
 * Rola o drop do material de upgrade da profissão com base no ranque da arma
 * equipada. Retorna null se a arma não for de profissão ou se os dados não
 * passarem na chance.
 */
export function rollProfessionMaterial(
  weaponId: string,
): { itemId: MaterialId; qty: number } | null {
  const config = getProfessionWeaponConfig(weaponId);
  if (!config) return null;
  const chance = getProfessionMaterialDropChance(weaponId);
  if (chance <= 0) return null;
  if (Math.random() >= chance) return null;
  return { itemId: config.materialId, qty: 1 };
}

/** Sobe uma arma de profissão do ranque atual para o próximo (index + 1). */
export function getNextProfessionTier(
  tier: ProfessionWeaponTierId,
): ProfessionWeaponTierId | null {
  const index = PROFESSION_WEAPON_TIERS.findIndex((t) => t.id === tier);
  const next = PROFESSION_WEAPON_TIERS[index + 1];
  return next ? next.id : null;
}
