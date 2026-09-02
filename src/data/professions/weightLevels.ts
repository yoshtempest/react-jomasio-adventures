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

export const WEIGHT_LEVELS: WeightLevel[] = [
  {
    weightLevel: 0,
    commonId: "weight_halter_1kg",
    rareId: "weight_halter_cromado_1kg",
    xp: 10,
    rareChance: 0.05,
  },
  {
    weightLevel: 5,
    commonId: "weight_anilha_2kg",
    rareId: "weight_anilha_polida_2kg",
    xp: 15,
    rareChance: 0.05,
  },
  {
    weightLevel: 10,
    commonId: "weight_halter_2kg",
    rareId: "weight_halter_reforcado_2kg",
    xp: 20,
    rareChance: 0.05,
  },
  {
    weightLevel: 15,
    commonId: "weight_anilha_5kg",
    rareId: "weight_anilha_dourada_5kg",
    xp: 25,
    rareChance: 0.05,
  },
  {
    weightLevel: 20,
    commonId: "weight_halter_5kg",
    rareId: "weight_halter_titanio_5kg",
    xp: 30,
    rareChance: 0.06,
  },
  {
    weightLevel: 25,
    commonId: "weight_anilha_10kg",
    rareId: "weight_anilha_temperada_10kg",
    xp: 35,
    rareChance: 0.06,
  },
  {
    weightLevel: 30,
    commonId: "weight_halter_10kg",
    rareId: "weight_halter_aco_10kg",
    xp: 40,
    rareChance: 0.06,
  },
  {
    weightLevel: 35,
    commonId: "weight_anilha_15kg",
    rareId: "weight_anilha_pesada_15kg",
    xp: 45,
    rareChance: 0.06,
  },
  {
    weightLevel: 40,
    commonId: "weight_barra_curta",
    rareId: "weight_barra_curta_reforcada",
    xp: 50,
    rareChance: 0.06,
  },
  {
    weightLevel: 45,
    commonId: "weight_halter_15kg",
    rareId: "weight_halter_brutal_15kg",
    xp: 55,
    rareChance: 0.07,
  },
  {
    weightLevel: 50,
    commonId: "weight_anilha_20kg",
    rareId: "weight_anilha_imperial_20kg",
    xp: 60,
    rareChance: 0.07,
  },
  {
    weightLevel: 55,
    commonId: "weight_barra_olimpica",
    rareId: "weight_barra_olimpica_perfeita",
    xp: 65,
    rareChance: 0.07,
  },
  {
    weightLevel: 60,
    commonId: "weight_halter_20kg",
    rareId: "weight_halter_kroomium",
    xp: 70,
    rareChance: 0.07,
  },
  {
    weightLevel: 65,
    commonId: "weight_anilha_25kg",
    rareId: "weight_anilha_congelada_25kg",
    xp: 75,
    rareChance: 0.07,
  },
  {
    weightLevel: 70,
    commonId: "weight_barra_agachamento",
    rareId: "weight_barra_soberana_agachamento",
    xp: 80,
    rareChance: 0.07,
  },
  {
    weightLevel: 75,
    commonId: "weight_halter_25kg",
    rareId: "weight_halter_colossal_25kg",
    xp: 85,
    rareChance: 0.08,
  },
  {
    weightLevel: 80,
    commonId: "weight_anilha_30kg",
    rareId: "weight_anilha_negra_30kg",
    xp: 90,
    rareChance: 0.08,
  },
  {
    weightLevel: 85,
    commonId: "weight_barra_supino",
    rareId: "weight_barra_mitica_supino",
    xp: 95,
    rareChance: 0.08,
  },
  {
    weightLevel: 90,
    commonId: "weight_halter_30kg",
    rareId: "weight_halter_safira_30kg",
    xp: 100,
    rareChance: 0.08,
  },
  {
    weightLevel: 95,
    commonId: "weight_anilha_40kg",
    rareId: "weight_anilha_soberana_40kg",
    xp: 105,
    rareChance: 0.08,
  },
  {
    weightLevel: 100,
    commonId: "weight_barra_50kg",
    rareId: "weight_barra_monstruosa_50kg",
    xp: 110,
    rareChance: 0.09,
  },
  {
    weightLevel: 105,
    commonId: "weight_halter_40kg",
    rareId: "weight_halter_sombrio_40kg",
    xp: 115,
    rareChance: 0.09,
  },
  {
    weightLevel: 110,
    commonId: "weight_anilha_50kg",
    rareId: "weight_anilha_mercurio_50kg",
    xp: 120,
    rareChance: 0.09,
  },
  {
    weightLevel: 115,
    commonId: "weight_barra_forca",
    rareId: "weight_barra_absoluta",
    xp: 125,
    rareChance: 0.09,
  },
  {
    weightLevel: 120,
    commonId: "weight_halter_50kg",
    rareId: "weight_halter_prata_50kg",
    xp: 130,
    rareChance: 0.09,
  },
  {
    weightLevel: 125,
    commonId: "weight_anilha_60kg",
    rareId: "weight_anilha_obsidiana_60kg",
    xp: 135,
    rareChance: 0.1,
  },
  {
    weightLevel: 130,
    commonId: "weight_barra_70kg",
    rareId: "weight_barra_congelada_70kg",
    xp: 140,
    rareChance: 0.1,
  },
  {
    weightLevel: 135,
    commonId: "weight_halter_60kg",
    rareId: "weight_halter_zircon_60kg",
    xp: 145,
    rareChance: 0.1,
  },
  {
    weightLevel: 140,
    commonId: "weight_anilha_80kg",
    rareId: "weight_anilha_vazio_80kg",
    xp: 150,
    rareChance: 0.1,
  },
  {
    weightLevel: 145,
    commonId: "weight_barra_100kg",
    rareId: "weight_barra_simbiotica_100kg",
    xp: 155,
    rareChance: 0.1,
  },
  {
    weightLevel: 150,
    commonId: "weight_halter_80kg",
    rareId: "weight_halter_zircomet_80kg",
    xp: 160,
    rareChance: 0.1,
  },
  {
    weightLevel: 155,
    commonId: "weight_anilha_100kg",
    rareId: "weight_anilha_fragmonitica_100kg",
    xp: 165,
    rareChance: 0.1,
  },
] as const satisfies WeightLevel[];

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
