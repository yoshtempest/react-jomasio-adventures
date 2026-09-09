import { createLevels } from "@/utils/professions/createLevel";

/**
 * Níveis de peso para a profissão Bodybuilder.
 *
 * Cada nível define o peso "comum" (drop garantido) e a sua "forma rara"
 * (item dropável da profissão, dropado com chance). Os níveis são fixos: um
 * nível por peso, do nv.0 (Halter de 1 kg) ao nv.155 (Anilha de 100 kg).
 *
 * A profissão Bodybuilder precisa estar em nv >= weightLevel para treinar
 * com o peso. A cada 5 níveis temos um item dropável da profissão (a forma
 * rara).
 */
export type WeightLevel = {
  weightLevel: number;
  commonId: ItemId;
  rareId: ItemId;
  /** XP base fornecido ao treinar com este peso (antes do scaling por nível). */
  xp: number;
  /** Chance de dropar a forma rara (0-1). */
  rareChance: number;
};

export const WEIGHT_LEVELS: WeightLevel[] = createLevels("weightLevel", [
  {
    level: 0,
    commonId: "weight_halter_1kg",
    rareId: "weight_halter_cromado_1kg",
    rareChance: 0.05,
  },
  {
    level: 5,
    commonId: "weight_anilha_2kg",
    rareId: "weight_anilha_polida_2kg",
    rareChance: 0.05,
  },
  {
    level: 10,
    commonId: "weight_halter_2kg",
    rareId: "weight_halter_reforcado_2kg",
    rareChance: 0.05,
  },
  {
    level: 15,
    commonId: "weight_anilha_5kg",
    rareId: "weight_anilha_dourada_5kg",
    rareChance: 0.05,
  },
  {
    level: 20,
    commonId: "weight_halter_5kg",
    rareId: "weight_halter_titanio_5kg",
    rareChance: 0.06,
  },
  {
    level: 25,
    commonId: "weight_anilha_10kg",
    rareId: "weight_anilha_temperada_10kg",
    rareChance: 0.06,
  },
  {
    level: 30,
    commonId: "weight_halter_10kg",
    rareId: "weight_halter_aco_10kg",
    rareChance: 0.06,
  },
  {
    level: 35,
    commonId: "weight_anilha_15kg",
    rareId: "weight_anilha_pesada_15kg",
    rareChance: 0.06,
  },
  {
    level: 40,
    commonId: "weight_barra_curta",
    rareId: "weight_barra_curta_reforcada",
    rareChance: 0.06,
  },
  {
    level: 45,
    commonId: "weight_halter_15kg",
    rareId: "weight_halter_brutal_15kg",
    rareChance: 0.07,
  },
  {
    level: 50,
    commonId: "weight_anilha_20kg",
    rareId: "weight_anilha_imperial_20kg",
    rareChance: 0.07,
  },
  {
    level: 55,
    commonId: "weight_barra_olimpica",
    rareId: "weight_barra_olimpica_perfeita",
    rareChance: 0.07,
  },
  {
    level: 60,
    commonId: "weight_halter_20kg",
    rareId: "weight_halter_kroomium",
    rareChance: 0.07,
  },
  {
    level: 65,
    commonId: "weight_anilha_25kg",
    rareId: "weight_anilha_congelada_25kg",
    rareChance: 0.07,
  },
  {
    level: 70,
    commonId: "weight_barra_agachamento",
    rareId: "weight_barra_soberana_agachamento",
    rareChance: 0.07,
  },
  {
    level: 75,
    commonId: "weight_halter_25kg",
    rareId: "weight_halter_colossal_25kg",
    rareChance: 0.08,
  },
  {
    level: 80,
    commonId: "weight_anilha_30kg",
    rareId: "weight_anilha_negra_30kg",
    rareChance: 0.08,
  },
  {
    level: 85,
    commonId: "weight_barra_supino",
    rareId: "weight_barra_mitica_supino",
    rareChance: 0.08,
  },
  {
    level: 90,
    commonId: "weight_halter_30kg",
    rareId: "weight_halter_safira_30kg",
    rareChance: 0.08,
  },
  {
    level: 95,
    commonId: "weight_anilha_40kg",
    rareId: "weight_anilha_soberana_40kg",
    rareChance: 0.08,
  },
  {
    level: 100,
    commonId: "weight_barra_50kg",
    rareId: "weight_barra_monstruosa_50kg",
    rareChance: 0.09,
  },
  {
    level: 105,
    commonId: "weight_halter_40kg",
    rareId: "weight_halter_sombrio_40kg",
    rareChance: 0.09,
  },
  {
    level: 110,
    commonId: "weight_anilha_50kg",
    rareId: "weight_anilha_mercurio_50kg",
    rareChance: 0.09,
  },
  {
    level: 115,
    commonId: "weight_barra_forca",
    rareId: "weight_barra_absoluta",
    rareChance: 0.09,
  },
  {
    level: 120,
    commonId: "weight_halter_50kg",
    rareId: "weight_halter_prata_50kg",
    rareChance: 0.09,
  },
  {
    level: 125,
    commonId: "weight_anilha_60kg",
    rareId: "weight_anilha_obsidiana_60kg",
    rareChance: 0.1,
  },
  {
    level: 130,
    commonId: "weight_barra_70kg",
    rareId: "weight_barra_congelada_70kg",
    rareChance: 0.1,
  },
  {
    level: 135,
    commonId: "weight_halter_60kg",
    rareId: "weight_halter_zircon_60kg",
    rareChance: 0.1,
  },
  {
    level: 140,
    commonId: "weight_anilha_80kg",
    rareId: "weight_anilha_vazio_80kg",
    rareChance: 0.1,
  },
  {
    level: 145,
    commonId: "weight_barra_100kg",
    rareId: "weight_barra_simbiotica_100kg",
    rareChance: 0.1,
  },
  {
    level: 150,
    commonId: "weight_halter_80kg",
    rareId: "weight_halter_zircomet_80kg",
    rareChance: 0.1,
  },
  {
    level: 155,
    commonId: "weight_anilha_100kg",
    rareId: "weight_anilha_fragmonitica_100kg",
    rareChance: 0.1,
  },
]);

/** Nível máximo de peso existente no jogo (topo da tabela). */
export const MAX_WEIGHT_LEVEL =
  WEIGHT_LEVELS[WEIGHT_LEVELS.length - 1]?.weightLevel ?? 0;

/** Retorna o peso de um dado nível, ou null quando não existe peso no nível. */
export function getWeightLevelByTrainLevel(
  weightLevel: number,
): WeightLevel | null {
  return WEIGHT_LEVELS.find((w) => w.weightLevel === weightLevel) ?? null;
}

/** Nível mínimo de peso disponível (o mais baixo treinável). */
export function getLowestWeightLevel(): number {
  return WEIGHT_LEVELS[0]?.weightLevel ?? 0;
}
