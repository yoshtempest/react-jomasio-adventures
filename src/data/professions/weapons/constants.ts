import type { ProfessionId } from "@/utils/types/player/profession";
import type { MaterialId } from "@/data/items/crafting";
import type { ProfessionWeaponConfig } from "./types";
import type { ProfessionWeaponTier } from "./types";
import type { ProfessionWeaponTierId } from "./types";

export const PROFESSION_WEAPON_TIERS: readonly ProfessionWeaponTier[] = [
  {
    id: "comum",
    rank: 1,
    label: "Comum",
    damageBonus: 0.05,
    materialDrop: 0.01,
    materialQty: 1,
  },
  {
    id: "raro",
    rank: 3,
    label: "Raro",
    damageBonus: 0.08,
    materialDrop: 0.04,
    materialQty: 2,
  },
  {
    id: "epico",
    rank: 5,
    label: "Épico",
    damageBonus: 0.12,
    materialDrop: 0.1,
    materialQty: 3,
  },
  {
    id: "boss",
    rank: 7,
    label: "Boss",
    damageBonus: 0.16,
    materialDrop: 0.2,
    materialQty: 4,
  },
  {
    id: "lendario",
    rank: 9,
    label: "Lendário",
    damageBonus: 0.22,
    materialDrop: 0.35,
    materialQty: 5,
  },
] as const;

const WEAPON_IDS = {
  alchemist: "weapon_cauldron",
  chef: "weapon_pan",
  lumberjack: "weapon_axe",
  farmer: "weapon_hoe",
  fisher: "weapon_fishing_rod",
  butcher: "weapon_cleaver",
  bodyBuilder: "weapon_dumbbell",
  mechanic: "weapon_adjustable_wrench",
  miner: "weapon_pickaxe",
} as const satisfies Record<ProfessionId, EquipmentId>;

const MATERIAL_IDS = {
  alchemist: "alchemy_flask",
  chef: "secret_ingredient",
  lumberjack: "prof_mat_lumberjack",
  farmer: "prof_mat_farmer",
  fisher: "prof_mat_fisher",
  butcher: "prof_mat_butcher",
  bodyBuilder: "prof_mat_bodyBuilder",
  mechanic: "prof_mat_mechanic",
  miner: "prof_mat_miner",
} as const satisfies Record<ProfessionId, MaterialId>;

/**
 * Como cada profissão é a tipagem (elemento) que sua arma enfrenta com
 * vantagem, e o material único de upgrade.
 */
export const PROFESSION_WEAPONS: Record<ProfessionId, ProfessionWeaponConfig> =
  {
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
  };

export const TIER_SUFFIX: Record<
  Exclude<ProfessionWeaponTierId, "comum">,
  string
> = {
  raro: "raro",
  epico: "epico",
  boss: "boss",
  lendario: "lendario",
};
