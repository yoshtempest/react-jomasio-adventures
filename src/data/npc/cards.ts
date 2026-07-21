export type NpcCard = {
  id: string;
  npcType: string;
  name: string;
  npcClass: NPCClass;
  description: string;
  attack: number;
  defense: number;
  code: string;
};

function hashCode(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) - h + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function statInRange(
  npcType: string,
  min: number,
  max: number,
  seed: number,
): number {
  const h = hashCode(npcType + seed);
  return min + (h % (max - min + 1));
}

function generateCode(npcType: string): string {
  const h = hashCode(npcType + "_code_v1");
  return String(h).padStart(10, "0").slice(0, 10);
}

const CLASS_RANGES: Record<NPCClass, { atk: [number, number]; def: [number, number] }> = {
  common:    { atk: [80, 299],   def: [40, 199] },
  rare:      { atk: [200, 499],  def: [150, 399] },
  epic:      { atk: [400, 699],  def: [300, 599] },
  boss:      { atk: [600, 899],  def: [500, 799] },
  legendary: { atk: [800, 999],  def: [700, 999] },
};

function makeCard(
  npcType: string,
  name: string,
  npcClass: NPCClass,
  description: string,
): NpcCard {
  const r = CLASS_RANGES[npcClass];
  return {
    id: `card_${npcType}`,
    npcType,
    name,
    npcClass,
    description,
    attack: statInRange(npcType, r.atk[0], r.atk[1], 1),
    defense: statInRange(npcType, r.def[0], r.def[1], 2),
    code: generateCode(npcType),
  };
}

export const NPC_CARDS: Record<string, NpcCard> = {
  hungryDeath: makeCard(
    "hungryDeath",
    "Carta de Morto de Fome",
    "common",
    "Ele não quer seu sangue. Ele quer seu lanche.",
  ),
  rice: makeCard(
    "rice",
    "Carta de Bolinho de Arroz",
    "common",
    "Não é food. É um estilo de vida.",
  ),
  hungryDog: makeCard(
    "hungryDog",
    "Carta de Cachorro Faminto",
    "common",
    "Só queria um osso. Recebeu um soco.",
  ),
  hungryFish: makeCard(
    "hungryFish",
    "Carta de Peixe Faminto",
    "common",
    "Tão fraco que morre afogado.",
  ),
  hungryCow: makeCard(
    "hungryCow",
    "Carta de Vaca Faminta",
    "common",
    "Moo? Mais como... morreu.",
  ),
  hungryPig: makeCard(
    "hungryPig",
    "Carta de Porco Faminto",
    "common",
    "Não era da china. Era do bairro.",
  ),
  figurantOfBaalCult: makeCard(
    "figurantOfBaalCult",
    "Carta de Figurante do Culto de Baal",
    "common",
    "Nem sabia que era culto. Achava que era clube de leitura.",
  ),
  figurantOfMobyDickCult: makeCard(
    "figurantOfMobyDickCult",
    "Carta de Figurante do Culto de Moby Dick",
    "common",
    "Estava aqui só pelo churrasco.",
  ),
  figurantOfDragonKingCult: makeCard(
    "figurantOfDragonKingCult",
    "Carta de Figurante do Culto do Rei Dragão",
    "common",
    "Acreditou que era cosplay. Foi tarde demais.",
  ),
  piupiu: makeCard(
    "piupiu",
    "Carta de Pinto",
    "rare",
    "Piu piu? Mais como... au au.",
  ),
  jhowsimar: makeCard(
    "jhowsimar",
    "Carta de Jhowsimar",
    "rare",
    "O vigia mais assustador que já existiu. Menos que o porteiro da federal.",
  ),
  goat: makeCard(
    "goat",
    "Carta de Bode",
    "rare",
    "GOAT significa Greatest Of All Time. Mas ele era o pior.",
  ),
  fischer: makeCard(
    "fischer",
    "Carta de Fischer",
    "rare",
    "Fischer Price? Não. Fischer Dor.",
  ),
  crocodile: makeCard(
    "crocodile",
    "Carta de Crocodilo",
    "rare",
    "Crocodilo de bote? Não. Crocodilo de bote quente.",
  ),
  vandinhaFragment: makeCard(
    "vandinhaFragment",
    "Carta de Fragmento de Vandinha",
    "epic",
    "Só um pedaço e já é mais forte que você.",
  ),
  srGuaxinim: makeCard(
    "srGuaxinim",
    "Carta de Sr. Guaxinim",
    "epic",
    "Guaxinim com coroa. Elegante. Mortal. Com fome de lixo.",
  ),
  riquelsonDog: makeCard(
    "riquelsonDog",
    "Carta de Cachorro de Riquelson",
    "epic",
    "O cachorro do Riquelson. Ele morde. Muito.",
  ),
  baiano: makeCard(
    "baiano",
    "Carta de Baiano",
    "epic",
    "Não é baiano de praia. É baiano de porrada.",
  ),
  elitCrocodile: makeCard(
    "elitCrocodile",
    "Carta de Crocodilo de Elite",
    "epic",
    "Crocodilo com diploma. Mais perigoso que um sem.",
  ),
  deise: makeCard(
    "deise",
    "Carta de Deise",
    "boss",
    "Lich imortal. Imortal de verdade. Pelo menos até você chegar.",
  ),
  slimita: makeCard(
    "slimita",
    "Carta de Slimita",
    "boss",
    "A paquera mais perigosa do Jomasio. Cuidado com o olhar.",
  ),
  hungryKing: makeCard(
    "hungryKing",
    "Carta de Rei Faminto",
    "boss",
    "Rei de quê? De passar fome.",
  ),
  neimito: makeCard(
    "neimito",
    "Carta de Neimito",
    "boss",
    "Mestre do calor. E de te derreter.",
  ),
  planetarySisters: makeCard(
    "planetarySisters",
    "Carta de Irmãs Planetárias",
    "boss",
    "Irmãs que se entendem. Que assustador.",
  ),
  maugrelo: makeCard(
    "maugrelo",
    "Carta de Maugrelo",
    "boss",
    "Parece que gosta de apanhar. Estranho.",
  ),
  maurao: makeCard(
    "maurao",
    "Carta de Maurão",
    "boss",
    "Salvou ele da loucura. Mas a loucura não salvou a gente.",
  ),
  spiritMotocycler: makeCard(
    "spiritMotocycler",
    "Carta de Motoqueiro Fantasma",
    "boss",
    "Juan Derson. O fantasma mais motorizado do cemitério.",
  ),
  tim: makeCard(
    "tim",
    "Carta de Tim",
    "boss",
    "Duas facas de sashimi e muita raiva. Não é um bom combo.",
  ),
  muyMacho: makeCard(
    "muyMacho",
    "Carta de Muy Macho",
    "boss",
    "O nome diz tudo. Macho demais pra morrer.",
  ),
  lupita: makeCard(
    "lupita",
    "Carta de Lupita",
    "boss",
    "Lupita. Não confunda com a da novela.",
  ),
  monsterOfNessRiver: makeCard(
    "monsterOfNessRiver",
    "Carta de Monstro do Rio Ness",
    "boss",
    "Nem é do Ness. É do rio da esquina.",
  ),
  mobyDick: makeCard(
    "mobyDick",
    "Carta de Moby Dick",
    "boss",
    "A baleia mais famosa da literatura. E da porrada.",
  ),
  ains: makeCard(
    "ains",
    "Carta de Ains",
    "boss",
    "OVERLORD. Mas caiu que nem um saco de batata.",
  ),
  baal: makeCard(
    "baal",
    "Carta de Baal",
    "legendary",
    "Deus do culto. Agora é carta no seu inventário. Humilhante.",
  ),
  madame: makeCard(
    "madame",
    "Carta de Madame",
    "legendary",
    "Aranha de caça. Caça você.",
  ),
  yangKai: makeCard(
    "yangKai",
    "Carta de Yang Kai",
    "legendary",
    "Yang? Yin? Não. Só porrada.",
  ),
  dragonKing: makeCard(
    "dragonKing",
    "Carta de Rei Dragão",
    "legendary",
    "Rei dos dragões. E da sua coleção agora.",
  ),
  technoblade: makeCard(
    "technoblade",
    "Carta de Technoblade",
    "legendary",
    "Technoblade never dies. Mas virou carta.",
  ),
  trueVandinha: makeCard(
    "trueVandinha",
    "Carta de Verdadeira Vandinha",
    "legendary",
    "A real. A original. A que dói mais.",
  ),
};

export const CARD_CHANCE = 0.01;

export function rollCardDrop(npcType: string): NpcCard | null {
  const card = NPC_CARDS[npcType];
  if (!card) return null;
  if (Math.random() >= CARD_CHANCE) return null;
  return card;
}
