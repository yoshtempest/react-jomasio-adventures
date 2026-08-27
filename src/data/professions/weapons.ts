import type { ProfessionId } from "@/utils/types/player/profession";
import type { EquipmentRank } from "@/utils/types/player/equipment";
import type { ElementType } from "@/utils/types/battle/element";
import type { MaterialId } from "@/data/items/crafting";

/**
 * Ranques da arma de profissão, do comum ao lendário.
 * `rank` mapeia para o EquipmentRank existente para integrar com o sistema
 * de drops e cores de raridade já existente no jogo.
 */
export type ProfessionWeaponTierId =
  | "comum"
  | "raro"
  | "epico"
  | "boss"
  | "lendario";

export type ProfessionWeaponTier = {
  id: ProfessionWeaponTierId;
  rank: EquipmentRank;
  label: string;
  /** Bônus % de dano contra NPCs do elemento alvo (0.05 = +5%). */
  damageBonus: number;
  /** Chance % de dropar o material da profissão ao coletar com esta arma. */
  materialDrop: number;
  /** Quantidade do material necessária para subir PARA o próximo ranque. */
  materialQty: number;
};

export const PROFESSION_WEAPON_TIERS: readonly ProfessionWeaponTier[] = [
  { id: "comum", rank: 1, label: "Comum", damageBonus: 0.05, materialDrop: 0.01, materialQty: 1 },
  { id: "raro", rank: 3, label: "Raro", damageBonus: 0.08, materialDrop: 0.04, materialQty: 2 },
  { id: "epico", rank: 5, label: "Épico", damageBonus: 0.12, materialDrop: 0.1, materialQty: 3 },
  { id: "boss", rank: 7, label: "Boss", damageBonus: 0.16, materialDrop: 0.2, materialQty: 4 },
  { id: "lendario", rank: 9, label: "Lendário", damageBonus: 0.22, materialDrop: 0.35, materialQty: 5 },
] as const;

export type ProfessionWeaponConfig = {
  professionId: ProfessionId;
  /** Nome base da arma (ex: "Vara de Pesca"). */
  baseName: string;
  /** arma base já existente (ranque comum). */
  baseToolId: EquipmentId;
  /** Tipagem inimiga contra a qual a arma causa dano extra. */
  element: ElementType;
  /** Material único de upgrade da profissão. */
  materialId: MaterialId;
  /** Nome do material para exibição. */
  materialName: string;
};

const WEAPON_IDS = {
  alchemist: "weapon_cauldron",
  chef: "weapon_pan",
  lumberjack: "weapon_axe",
  farmer: "weapon_hoe",
  fisher: "weapon_fishing_rod",
  pastryChef: "weapon_rolling_pin",
  butcher: "weapon_cleaver",
  bodyBuilder: "weapon_dumbbell",
  mechanic: "weapon_adjustable_wrench",
  miner: "weapon_pickaxe",
  painter: "weapon_paint",
} as const satisfies Record<ProfessionId, EquipmentId>;

const MATERIAL_IDS = {
  alchemist: "prof_mat_alchemist",
  chef: "prof_mat_chef",
  lumberjack: "prof_mat_lumberjack",
  farmer: "prof_mat_farmer",
  fisher: "prof_mat_fisher",
  pastryChef: "prof_mat_pastryChef",
  butcher: "prof_mat_butcher",
  bodyBuilder: "prof_mat_bodyBuilder",
  mechanic: "prof_mat_mechanic",
  miner: "prof_mat_miner",
  painter: "prof_mat_painter",
} as const satisfies Record<ProfessionId, MaterialId>;

/**
 * Como cada profissão é a tipagem (elemento) que sua arma enfrenta com
 * vantagem, e o material único de upgrade.
 */
export const PROFESSION_WEAPONS: Record<ProfessionId, ProfessionWeaponConfig> = {
  alchemist: {
    professionId: "alchemist",
    baseName: "Caldeirão",
    baseToolId: WEAPON_IDS.alchemist,
    element: "Pyrus",
    materialId: MATERIAL_IDS.alchemist,
    materialName: "Frasco de Alquimia",
  },
  chef: {
    professionId: "chef",
    baseName: "Panela",
    baseToolId: WEAPON_IDS.chef,
    element: "Pyrus",
    materialId: MATERIAL_IDS.chef,
    materialName: "Tempero Secreto",
  },
  lumberjack: {
    professionId: "lumberjack",
    baseName: "Machado",
    baseToolId: WEAPON_IDS.lumberjack,
    element: "Natura",
    materialId: MATERIAL_IDS.lumberjack,
    materialName: "Casca de Carvalho Ancestral",
  },
  farmer: {
    professionId: "farmer",
    baseName: "Enxada",
    baseToolId: WEAPON_IDS.farmer,
    element: "Subterra",
    materialId: MATERIAL_IDS.farmer,
    materialName: "Semente Mágica",
  },
  fisher: {
    professionId: "fisher",
    baseName: "Vara de Pesca",
    baseToolId: WEAPON_IDS.fisher,
    element: "Aquos",
    materialId: MATERIAL_IDS.fisher,
    materialName: "Peixe Dourado",
  },
  pastryChef: {
    professionId: "pastryChef",
    baseName: "Rolo de Massa",
    baseToolId: WEAPON_IDS.pastryChef,
    element: "Natura",
    materialId: MATERIAL_IDS.pastryChef,
    materialName: "Açúcar de Cristal",
  },
  butcher: {
    professionId: "butcher",
    baseName: "Cutelo",
    baseToolId: WEAPON_IDS.butcher,
    element: "Haos",
    materialId: MATERIAL_IDS.butcher,
    materialName: "Carne Nobre",
  },
  bodyBuilder: {
    professionId: "bodyBuilder",
    baseName: "Halter",
    baseToolId: WEAPON_IDS.bodyBuilder,
    element: "Haos",
    materialId: MATERIAL_IDS.bodyBuilder,
    materialName: "Proteína Extrema",
  },
  mechanic: {
    professionId: "mechanic",
    baseName: "Chave Inglesa",
    baseToolId: WEAPON_IDS.mechanic,
    element: "Metallum",
    materialId: MATERIAL_IDS.mechanic,
    materialName: "Parafuso Especial",
  },
  miner: {
    professionId: "miner",
    baseName: "Picareta",
    baseToolId: WEAPON_IDS.miner,
    element: "Subterra",
    materialId: MATERIAL_IDS.miner,
    materialName: "Minério Raro",
  },
  painter: {
    professionId: "painter",
    baseName: "Pincel",
    baseToolId: WEAPON_IDS.painter,
    element: "Psychicus",
    materialId: MATERIAL_IDS.painter,
    materialName: "Tinta Rara",
  },
};

const TIER_SUFFIX: Record<Exclude<ProfessionWeaponTierId, "comum">, string> = {
  raro: "raro",
  epico: "epico",
  boss: "boss",
  lendario: "lendario",
};

/** Arma (EquipmentId) de uma profissão num dado ranque. */
export function getProfessionWeaponId(
  config: ProfessionWeaponConfig,
  tier: ProfessionWeaponTierId,
): EquipmentId {
  if (tier === "comum") return config.baseToolId;
  return `${config.baseToolId}_${TIER_SUFFIX[tier]}`;
}

/** Tier (indice 0..4) do ranque de uma arma de profissão. */
export function getTierIndex(tier: ProfessionWeaponTierId): number {
  return PROFESSION_WEAPON_TIERS.findIndex((t) => t.id === tier);
}

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

/** Se `weaponId` é uma arma de profissão evoluída, retorna o id base (comum). */
export function getBaseProfessionWeaponId(weaponId: string): string | null {
  for (const config of Object.values(PROFESSION_WEAPONS)) {
    if (weaponId === config.baseToolId) return config.baseToolId;
    for (const tier of PROFESSION_WEAPON_TIERS) {
      if (weaponId === getProfessionWeaponId(config, tier.id)) return config.baseToolId;
    }
  }
  return null;
}

/** Identifica o ranque de uma arma de profissão (0..4). Retorna null se não for arma de profissão. */
export function getProfessionWeaponTier(weaponId: string): ProfessionWeaponTierId | null {
  for (const config of Object.values(PROFESSION_WEAPONS)) {
    for (const tier of PROFESSION_WEAPON_TIERS) {
      if (weaponId === getProfessionWeaponId(config, tier.id)) return tier.id;
    }
  }
  return null;
}
