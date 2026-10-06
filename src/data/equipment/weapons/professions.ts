import type {
  EquipmentDef,
  EquipmentStats,
} from "@/utils/types/player/equipment";
import { createEquipmentList } from "@/utils/equipment/createEquipmentList";
import {
  PROFESSION_WEAPONS,
  PROFESSION_WEAPON_TIERS,
  getProfessionWeaponId,
  type ProfessionWeaponConfig,
  type ProfessionWeaponTier,
} from "@/data/professions/weapons";

function scaleStats(
  base: Partial<EquipmentStats>,
  index: number,
): Partial<EquipmentStats> {
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
): Omit<EquipmentDef, "slot"> {
  return {
    id: getProfessionWeaponId(config, tier.id),
    name: `${config.baseName} ${tier.label}`,
    rank: tier.rank,
    stats: scaleStats(baseStats, index),
    craftOnly: true,
  };
}

const BASE_TOOL_STATS: Record<string, Partial<EquipmentStats>> = {
  weapon_pickaxe: { strength: 2 },
  weapon_cleaver: { strength: 2 },
  weapon_fishing_rod: { technique: 1 },
  weapon_hoe: { strength: 1 },
  weapon_cauldron: { technique: 1 },
  weapon_rolling_pin: { strength: 1 },
  weapon_dumbbell: { strength: 2 },
  weapon_axe: { strength: 2 },
  weapon_pan: { strength: 2 },
  weapon_adjustable_wrench: { strength: 1 },
  weapon_paint: { technique: 1 },
} as const satisfies Record<string, Partial<EquipmentStats>>;

/**
 * A anotação de tipo é obrigatória: sem ela a inferência passa por
 * `baseToolId: EquipmentId`, que é derivado de `EQUIPMENT_DB` — e este arquivo
 * alimenta esse banco, fechando o ciclo. A anotação curta o ciclo porque o tipo
 * declarado não depende do inicializador.
 */
const PROFESSION_RANKED_WEAPONS: readonly EquipmentDef[] = createEquipmentList(
  "weapon",
  Object.values(PROFESSION_WEAPONS).flatMap((config) =>
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
  ),
);

const BASE_TOOLS = createEquipmentList("weapon", [
  {
    id: "weapon_pickaxe",
    name: "Picareta",
    rank: 1,
    stats: { strength: 2 },
    craftOnly: true,
  },
  {
    id: "weapon_cleaver",
    name: "Cutelo",
    rank: 1,
    stats: { strength: 2 },
    craftOnly: true,
  },
  {
    id: "weapon_fishing_rod",
    name: "Vara de Pesca",
    rank: 1,
    stats: { technique: 1 },
    craftOnly: true,
  },
  {
    id: "weapon_hoe",
    name: "Enxada",
    rank: 1,
    stats: { strength: 1 },
    craftOnly: true,
  },
  {
    id: "weapon_cauldron",
    name: "Caldeirão",
    rank: 1,
    stats: { technique: 1 },
    craftOnly: true,
  },
  {
    id: "weapon_rolling_pin",
    name: "Rolo de Massa",
    rank: 1,
    stats: { strength: 1 },
    craftOnly: true,
  },
  {
    id: "weapon_dumbbell",
    name: "Halter",
    rank: 1,
    stats: { strength: 2 },
    craftOnly: true,
  },
  {
    id: "weapon_axe",
    name: "Machado",
    rank: 1,
    stats: { strength: 2 },
    craftOnly: true,
  },
  {
    id: "weapon_pan",
    name: "Panela",
    rank: 1,
    stats: { strength: 2 },
    craftOnly: true,
  },
  {
    id: "weapon_adjustable_wrench",
    name: "Chave Inglesa",
    rank: 1,
    stats: { strength: 1 },
    craftOnly: true,
  },
  {
    id: "weapon_paint",
    name: "Pincel",
    rank: 1,
    stats: { technique: 1 },
    craftOnly: true,
  },
]);

export const TOOL_WEAPONS = [
  ...BASE_TOOLS,
  ...PROFESSION_RANKED_WEAPONS,
] as const satisfies readonly EquipmentDef[];
