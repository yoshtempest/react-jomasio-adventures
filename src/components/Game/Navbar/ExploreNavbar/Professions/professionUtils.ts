import {
  PROFESSION_WEAPON_TIERS,
  getProfessionWeaponId,
  getProfessionWeaponTier,
  getTierIndex,
  type ProfessionWeaponConfig,
  type ProfessionWeaponTierId,
} from "@/data/professions/weapons";
import { PROFESSION_BADGES } from "@/data/professions/badge";
import type { EquipmentStats } from "@/utils/types/player/equipment";
import type { ProfessionId } from "@/utils/types/player/profession";

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
  const badge = PROFESSION_BADGES[id as ProfessionId];
  return badge ?? "";
}

// Tipado como `Partial<Record<keyof EquipmentStats, string>>` (e não `Record<string,
// string>`) porque quem chama itera `Object.entries(equipment.stats)`: um
// `Record<string, …>` aceitaria qualquer chave e um stat novo cairia no
// fallback mostrando a chave crua para o jogador.
const STAT_LABELS: Partial<Record<keyof EquipmentStats, string>> = {
  hp: "HP",
  strength: "Força",
  technique: "Técnica",
  spirit: "Espírito",
  cooldownReduction: "Redução de cooldown",
  armor: "Armadura",
  shield: "Escudo",
  vampirism: "Vampirismo",
  universalVampirism: "Vampirismo Universal",
  reflect: "Reflexão",
  tenacity: "Tenacidade",
  luck: "Sorte",
  maxHpDamage: "Dano HP",
  trueDamage: "Dano Real",
};

export function getStatLabel(key: string): string {
  return STAT_LABELS[key as keyof EquipmentStats] ?? key;
}
