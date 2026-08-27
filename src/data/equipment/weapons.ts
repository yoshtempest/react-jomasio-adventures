import type {
  EquipmentDef,
  EquipmentStats,
} from "@/utils/types/player/equipment";
import {
  PROFESSION_WEAPONS,
  PROFESSION_WEAPON_TIERS,
  getProfessionWeaponId,
  type ProfessionWeaponConfig,
  type ProfessionWeaponTier,
} from "@/data/professions/weapons";

function scaleStats(base: Partial<EquipmentStats>, index: number): Partial<EquipmentStats> {
  const factor = 1 + index * 0.6;
  const result: Partial<EquipmentStats> = {};
  for (const key of Object.keys(base) as (keyof EquipmentStats)[]) {
    const value = base[key];
    if (typeof value === "number") {
      result[key] = Math.round(value * factor);
    }
  }
  return result;
}

function buildRankedWeapon(
  config: ProfessionWeaponConfig,
  tier: ProfessionWeaponTier,
  index: number,
  baseStats: Partial<EquipmentStats>,
): EquipmentDef {
    return {
      id: getProfessionWeaponId(config, tier.id),
      name: `${config.baseName} ${tier.label}`,
      slot: "weapon",
      rank: tier.rank,
      stats: scaleStats(baseStats, index),
      craftOnly: true,
    };
  }

const BASE_TOOL_STATS: Record<string, Partial<EquipmentStats>> = {
  weapon_pickaxe: { strength: 2 },
  weapon_cleaver: { strength: 2 },
  weapon_fishing_rod: { intelligence: 1 },
  weapon_hoe: { strength: 1 },
  weapon_cauldron: { intelligence: 1 },
  weapon_rolling_pin: { strength: 1 },
  weapon_dumbbell: { strength: 2 },
  weapon_axe: { strength: 2 },
  weapon_pan: { strength: 2 },
  weapon_adjustable_wrench: { strength: 1 },
  weapon_paint: { intelligence: 1 },
} as const satisfies Record<string, Partial<EquipmentStats>>;

const PROFESSION_RANKED_WEAPONS: readonly EquipmentDef[] = Object.values(
  PROFESSION_WEAPONS,
).flatMap((config) =>
  PROFESSION_WEAPON_TIERS.flatMap((tier, index) => {
    if (tier.id === "comum") return [];
    return [
      buildRankedWeapon(
        config,
        tier,
        index,
        BASE_TOOL_STATS[config.baseToolId] ?? { strength: 1 },
      ),
    ];
  }),
);

export const WEAPONS = [
  {
    id: "weapon_espada_ferro",
    name: "Espada de Ferro",
    slot: "weapon",
    rank: 1,
    stats: { strength: 2 },
  },
  {
    id: "weapon_caneta_azul",
    name: "Caneta Azul",
    slot: "weapon",
    rank: 1,
    stats: { strength: 1 },
  },
  {
    id: "weapon_bengala_juju",
    name: "Bengala de Juju",
    slot: "weapon",
    rank: 1,
    stats: { strength: 2 },
  },
  {
    id: "weapon_livro_mestre",
    name: "Livro do Mestre",
    slot: "weapon",
    rank: 1,
    stats: { intelligence: 2 },
  },
  {
    id: "weapon_faca_osso",
    name: "Faca de Osso",
    slot: "weapon",
    rank: 1,
    stats: { strength: 1 },
  },
  {
    id: "weapon_lamina_arcana",
    name: "Lâmina Arcana",
    slot: "weapon",
    rank: 3,
    stats: { strength: 1, intelligence: 1 },
  },
  {
    id: "weapon_arco_preciso",
    name: "Arco Preciso",
    slot: "weapon",
    rank: 3,
    stats: { strength: 2, intelligence: 1 },
  },
  {
    id: "weapon_cajado_runas",
    name: "Cajado de Runas",
    slot: "weapon",
    rank: 3,
    stats: { intelligence: 3 },
  },
  {
    id: "weapon_espada_rei",
    name: "Espada do Rei",
    slot: "weapon",
    rank: 5,
    stats: { strength: 3, intelligence: 1, vampirism: 1, trueDamage: 1 },
  },
  {
    id: "weapon_cajado_arcano",
    name: "Cajado Arcano",
    slot: "weapon",
    rank: 5,
    stats: { strength: 1, intelligence: 3, vampirism: 1, trueDamage: 1 },
  },
  {
    id: "weapon_martelo_guerra",
    name: "Martelo de Guerra",
    slot: "weapon",
    rank: 7,
    stats: { strength: 4, vampirism: 2, maxHpDamage: 1, trueDamage: 2 },
  },
  {
    id: "weapon_cetro_real",
    name: "Cetro Real",
    slot: "weapon",
    rank: 7,
    stats: { strength: 2, intelligence: 3, vampirism: 2, trueDamage: 2 },
  },
  {
    id: "weapon_cetro_real",
    name: "Cetro Grande",
    slot: "weapon",
    rank: 8,
    stats: {
      strength: 2,
      intelligence: 3,
      vampirism: 2,
      maxHpDamage: 1,
      trueDamage: 3,
    },
  },
  {
    id: "weapon_espadao_artur",
    name: "Espadão do Rei Artur",
    slot: "weapon",
    rank: 9,
    stats: {
      strength: 5,
      intelligence: 4,
      vampirism: 3,
      maxHpDamage: 2,
      trueDamage: 4,
    },
  },
  {
    id: "weapon_pickaxe",
    name: "Picareta",
    slot: "weapon",
    rank: 1,
    stats: { strength: 2 },
    craftOnly: true,
  },
  {
    id: "weapon_cleaver",
    name: "Cutelo",
    slot: "weapon",
    rank: 1,
    stats: { strength: 2 },
    craftOnly: true,
  },
  {
    id: "weapon_fishing_rod",
    name: "Vara de Pesca",
    slot: "weapon",
    rank: 1,
    stats: { intelligence: 1 },
    craftOnly: true,
  },
  {
    id: "weapon_hoe",
    name: "Enxada",
    slot: "weapon",
    rank: 1,
    stats: { strength: 1 },
    craftOnly: true,
  },
  {
    id: "weapon_cauldron",
    name: "Caldeirão",
    slot: "weapon",
    rank: 1,
    stats: { intelligence: 1 },
    craftOnly: true,
  },
  {
    id: "weapon_rolling_pin",
    name: "Rolo de Massa",
    slot: "weapon",
    rank: 1,
    stats: { strength: 1 },
    craftOnly: true,
  },
  {
    id: "weapon_dumbbell",
    name: "Halter",
    slot: "weapon",
    rank: 1,
    stats: { strength: 2 },
    craftOnly: true,
  },
    {
    id: "weapon_axe",
    name: "Machado",
    slot: "weapon",
    rank: 1,
    stats: { strength: 2 },
    craftOnly: true,
  },
  {
    id: "weapon_pan",
    name: "Panela",
    slot: "weapon",
    rank: 1,
    stats: { strength: 2 },
    craftOnly: true,
  },
  {
    id: "weapon_adjustable_wrench",
    name: "Chave Inglesa",
    slot: "weapon",
    rank: 1,
    stats: { strength: 1 },
    craftOnly: true,
  },
  {
    id: "weapon_paint",
    name: "Pincel",
    slot: "weapon",
    rank: 1,
    stats: { intelligence: 1 },
    craftOnly: true,
  },
  ...PROFESSION_RANKED_WEAPONS,
] as const satisfies readonly EquipmentDef[];
