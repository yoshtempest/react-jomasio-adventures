import {
  PROFESSION_WEAPON_TIERS,
  getProfessionWeaponId,
  getProfessionWeaponTier,
  getTierIndex,
  type ProfessionWeaponConfig,
  type ProfessionWeaponTierId,
} from "@/data/professions/weapons";

export function getOwnedTierIndex(
  isOwned: (id: EquipmentId) => boolean,
  equippedWeaponId: string | undefined,
  config: ProfessionWeaponConfig,
): number {
  let max = -1;
  for (const tier of PROFESSION_WEAPON_TIERS) {
    const owned = isOwned(getProfessionWeaponId(config, tier.id));
    const idx = getTierIndex(tier.id);
    if (owned && idx > max) max = idx;
  }
  if (equippedWeaponId && getProfessionWeaponTier(equippedWeaponId)) {
    const idx = getTierIndex(
      getProfessionWeaponTier(equippedWeaponId) as ProfessionWeaponTierId,
    );
    if (idx > max) max = idx;
  }
  return max;
}

export function professionIcon(id: string): string {
  if (id === "lumberjack") return "/assets/badges/professions/farmer.svg";
  if (id === "chef") return "/assets/badges/professions/pastryChef.svg";
  if (id === "butcher") return "/assets/badges/professions/butcher.svg";
  if (id === "bodyBuilder") return "/assets/badges/professions/bodybuilder.svg";
  return `/assets/badges/professions/${id}.svg`;
}

export function getStatLabel(key: string): string {
  const labels: Record<string, string> = {
    hp: "HP",
    strength: "Força",
    intelligence: "Inteligência",
    armor: "Armadura",
    shield: "Escudo",
    vampirism: "Vampirismo",
    reflect: "Reflexão",
    tenacity: "Tenacidade",
    luck: "Sorte",
    maxHpDamage: "Dano HP",
    trueDamage: "Dano Real",
  };
  return labels[key] ?? key;
}
