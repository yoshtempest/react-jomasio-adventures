import { isNpcType, type NpcType } from "@/data/npc/npc";

/**
 * Multiplicadores de status por NPC — o jeito de dois NPCs da MESMA classe
 * (ex.: dois bosses) terem pontos fortes e fracos diferentes.
 *
 * Os quatro eixos multiplicam o status já calculado por
 * nível × classe × dificuldade (`getNpcStats`), então o NPC continua
 * escalando com o nível — só muda a "personalidade" dele: dano alto e vida
 * baixa (glass cannon) vs. dano baixo e vida alta (tanque), armadura
 * física ≠ mágica para punir builds, etc.
 *
 * Tabela **exaustiva**: todo NPC de `NPC_CLASSES` tem entrada, então NPC
 * novo quebra a compilação até os quatro eixos serem declarados. O valor
 * padrão é 1 (neutro) em todos — o balanceamento fino é ajuste manual por
 * NPC, com base no visual e no modelo de luta dele.
 */
export type NpcStatusMultipliers = {
  damage: number;
  physicalArmor: number;
  magicalArmor: number;
  hp: number;
};

/** Usado só para strings que não são um NpcType válido (fallback neutro). */
const NEUTRAL_STATUS_MULTIPLIERS: NpcStatusMultipliers = {
  damage: 1,
  physicalArmor: 1,
  magicalArmor: 1,
  hp: 1,
};

export const NPC_STATUS_MULTIPLIERS: Record<NpcType, NpcStatusMultipliers> = {
  /* Jomasio */
  hungryDeath: { damage: 1, physicalArmor: 1, magicalArmor: 1, hp: 1 },
  piupiu: { damage: 1, physicalArmor: 1, magicalArmor: 1, hp: 1 },
  rice: { damage: 1, physicalArmor: 1, magicalArmor: 1, hp: 1 },
  jhowsimar: { damage: 1, physicalArmor: 1, magicalArmor: 1, hp: 1 },
  goat: { damage: 1, physicalArmor: 1, magicalArmor: 1, hp: 1 },
  vandinhaFragment: { damage: 1, physicalArmor: 1, magicalArmor: 1, hp: 1 },
  trueVandinha: { damage: 1, physicalArmor: 1, magicalArmor: 1, hp: 1 },
  deise: { damage: 1, physicalArmor: 1, magicalArmor: 1, hp: 1 },
  necromancer: { damage: 1, physicalArmor: 1, magicalArmor: 1, hp: 1 },
  slimita: { damage: 1, physicalArmor: 1, magicalArmor: 1, hp: 1 },
  hungryKing: { damage: 1, physicalArmor: 1, magicalArmor: 1, hp: 1 },
  denis: { damage: 1, physicalArmor: 1, magicalArmor: 1, hp: 1 },
  srGuaxinim: { damage: 1, physicalArmor: 1, magicalArmor: 1, hp: 1 },
  neimito: { damage: 1, physicalArmor: 1, magicalArmor: 1, hp: 1 },
  planetarySisters: { damage: 1, physicalArmor: 1, magicalArmor: 1, hp: 1 },
  manim: { damage: 1, physicalArmor: 1, magicalArmor: 1, hp: 1 },
  maurao: { damage: 1, physicalArmor: 1, magicalArmor: 1, hp: 1 },
  maugrelo: { damage: 1, physicalArmor: 1, magicalArmor: 1, hp: 1 },

  /* Bocaina */
  hungryDog: { damage: 1, physicalArmor: 1, magicalArmor: 1, hp: 1 },
  lupita: { damage: 1, physicalArmor: 1, magicalArmor: 1, hp: 1 },
  duque: { damage: 1, physicalArmor: 1, magicalArmor: 1, hp: 1 },
  baiano: { damage: 1, physicalArmor: 1, magicalArmor: 1, hp: 1 },
  spiritMotocycler: { damage: 1, physicalArmor: 1, magicalArmor: 1, hp: 1 },
  tim: { damage: 1, physicalArmor: 1, magicalArmor: 1, hp: 1 },
  muyMacho: { damage: 1, physicalArmor: 1, magicalArmor: 1, hp: 1 },

  /* Lagoa grande */
  hungryFish: { damage: 1, physicalArmor: 1, magicalArmor: 1, hp: 1 },
  hungryCow: { damage: 1, physicalArmor: 1, magicalArmor: 1, hp: 1 },
  fischer: { damage: 1, physicalArmor: 1, magicalArmor: 1, hp: 1 },
  leviathan: { damage: 1, physicalArmor: 1, magicalArmor: 1, hp: 1 },
  /* Cachoeiras */
  figurantOfBaalCult: { damage: 1, physicalArmor: 1, magicalArmor: 1, hp: 1 },
  baal: { damage: 1, physicalArmor: 1, magicalArmor: 1, hp: 1 },
  madame: { damage: 1, physicalArmor: 1, magicalArmor: 1, hp: 1 },
  /* Barragem */
  figurantOfMobyDickCult: {
    damage: 1,
    physicalArmor: 1,
    magicalArmor: 1,
    hp: 1,
  },
  crocodile: { damage: 1, physicalArmor: 1, magicalArmor: 1, hp: 1 },
  elitCrocodile: { damage: 1, physicalArmor: 1, magicalArmor: 1, hp: 1 },
  mobyDick: { damage: 1, physicalArmor: 1, magicalArmor: 1, hp: 1 },
  yangKai: { damage: 1, physicalArmor: 1, magicalArmor: 1, hp: 1 },
  /* Tanque dos crávos */
  figurantOfDragonKingCult: {
    damage: 1,
    physicalArmor: 1,
    magicalArmor: 1,
    hp: 1,
  },
  ains: { damage: 1, physicalArmor: 1, magicalArmor: 1, hp: 1 },
  dragonKing: { damage: 1, physicalArmor: 1, magicalArmor: 1, hp: 1 },
  /* Lagoa do Canto */
  hungryPig: { damage: 1, physicalArmor: 1, magicalArmor: 1, hp: 1 },
  technoblade: { damage: 1, physicalArmor: 1, magicalArmor: 1, hp: 1 },

  /* Training */
  dummy: { damage: 1, physicalArmor: 1, magicalArmor: 1, hp: 1 },

  /* Indefinido */
  theDevourerOfWorlds: {
    damage: 1,
    physicalArmor: 1,
    magicalArmor: 1,
    hp: 1,
  },
  theStrongestManUnderTheHeavens: {
    damage: 1,
    physicalArmor: 1,
    magicalArmor: 1,
    hp: 1,
  },
  theBlackKnight: { damage: 1, physicalArmor: 1, magicalArmor: 1, hp: 1 },
  untrackedMonster: { damage: 1, physicalArmor: 1, magicalArmor: 1, hp: 1 },
  theMasterPiece: { damage: 1, physicalArmor: 1, magicalArmor: 1, hp: 1 },
  theChaosCreator: { damage: 1, physicalArmor: 1, magicalArmor: 1, hp: 1 },
  theFirstNightmare: {
    damage: 1,
    physicalArmor: 1,
    magicalArmor: 1,
    hp: 1,
  },
};

export function getNpcStatusMultipliers(npcType: string): NpcStatusMultipliers {
  if (!isNpcType(npcType)) return NEUTRAL_STATUS_MULTIPLIERS;
  return NPC_STATUS_MULTIPLIERS[npcType];
}
