import type { BestiaryEntryData } from "@/utils/types/player/bestiary";

export const BESTIARY_DATA: Record<string, BestiaryEntryData> = {
  /* ── Jomasio ── */
  jhowsimar: {
    npcType: "jhowsimar",
    name: "Jhowsimar",
    description:
      "Um lutador de rua enigmático que protege os becos de Jomasio. Ninguém sabe sua verdadeira origem.",
    location: "Jomasio",
    attacks: ["Agarro", "E te Jooj"],
  },
  hungryDeath: {
    npcType: "hungryDeath",
    name: "Morto de Fome",
    description:
      "Um zumbi faminto que vagueia pelas ruas de Jomasio em busca de carne fresca. Dizem que era um estudante que passou tempo demais sem comer.",
    location: "Jomasio",
    attacks: ["Agarrão Faminto", "Mordida Cheia de Fome"],
  },
  vandinhaFragment: {
    npcType: "vandinhaFragment",
    name: "Fragmento de Vandinha",
    description:
      "Uma versão fragmentada de Vandinha, espalhada por Jomasio. Cada fragmento guarda um pedaço de seu poder.",
    location: "Jomasio",
    attacks: ["Soco", "Olha o prato"],
  },
  piupiu: {
    npcType: "piupiu",
    name: "Piupiu",
    description:
      "Um pombo enorme e agressivo que domina os telhados de Jomasio. Não se deixe enganar pelo tamanho — ele é mais perigoso do que parece.",
    location: "Jomasio",
    attacks: ["Bicada Certeira", "Revoada de Penas"],
  },
  rice: {
    npcType: "rice",
    name: "Arroz",
    description:
      "Um saco de arroz ambulante que ganhou vida após um experimento culinário dar errado. Gruda mais do que parece.",
    location: "Jomasio",
    attacks: ["Grudada", "Chuva de Grãos"],
  },
  bean: {
    npcType: "bean",
    name: "Feijão",
    description:
      "O parceiro do Arroz. Juntos, formam o prato mais temido da cidade. Dizem que causa gases explosivos.",
    location: "Jomasio",
    attacks: ["Explosão de Gás", "Cascata de Feijões"],
  },
  goat: {
    npcType: "goat",
    name: "Bode",
    description:
      "Um bode demoníaco que aparece nos arredores de Jomasio. Seus olhos brilham vermelho sob a lua cheia.",
    location: "Jomasio",
    attacks: ["Chifrada Infernal", "Cabeçada"],
  },
  trueVandinha: {
    npcType: "trueVandinha",
    name: "Verdadeira Vandinha",
    description:
      "A forma completa de Vandinha. Dizem que ela é a guardiã de um segredo ancestral escondido em Jomasio.",
    location: "Jomasio",
    attacks: ["Dança das Sombras", "Grito Penetrante", "Noite Eterna"],
  },
  deise: {
    npcType: "deise",
    name: "Deise",
    description:
      "Uma guerreira implacável devota ao culto do rei dragão. Empunha lâminas gêmeas e jura lealdade ao dragão.",
    location: "Jomasio",
    attacks: ["Lâminas Gêmeas", "Golpe Giratório", "Fúria do Dragão"],
  },
  necromancer: {
    npcType: "necromancer",
    name: "Necromante",
    description:
      "Um feiticeiro sombrio que comanda mortos-vivos. Ele espreita nas catacumbas sob Jomasio.",
    location: "Tanque dos Crávos",
    attacks: ["Invocar Mortos", "Bola de Fogo Negra", "Maldição Arcana"],
  },
  slimita: {
    npcType: "slimita",
    name: "Slimita",
    description:
      "Uma criatura pegajosa e elástica que habita os esgotos de Jomasio. Ela pode se esticar e achatar para esmagar suas vítimas.",
    location: "Jomasio",
    attacks: ["Esmagamento", "Estiramento", "Salto Pegajoso"],
  },
  hungryKing: {
    npcType: "hungryKing",
    name: "Rei Faminto",
    description:
      "O governante dos mortos de fome, um ser colossal que consome tudo em seu caminho. Líder do culto ao rei dragão.",
    location: "Jomasio",
    attacks: ["Devorar", "Garra Colossal", "Fome Devastadora"],
  },
  denis: {
    npcType: "denis",
    name: "Denis",
    description:
      "Um ex-guarda-costas que enlouqueceu após um incidente trágico. Sua força bestial é lendária.",
    location: "Jomasio",
    attacks: ["Soco Brutal", "Agarrão"],
  },
  srGuaxinim: {
    npcType: "srGuaxinim",
    name: "Sr. Guaxinim",
    description:
      "Um guaxinim inteligente que comanda uma gangue de animais nas ruas de Jomasio. Não subestime sua astúcia.",
    location: "Jomasio",
    attacks: ["Garras Afiadas", "Investida Sorrateira"],
  },
  neimito: {
    npcType: "neimito",
    name: "Neimito",
    description:
      "Um jovem prodígio das artes marciais que busca provar seu valor. Seus movimentos são rápidos e imprevisíveis.",
    location: "Jomasio",
    attacks: ["Chute Voador", "Sequência Rápida"],
  },
  planetarySisters: {
    npcType: "planetarySisters",
    name: "Irmãs Planetárias",
    description:
      "Três irmãs que controlam forças celestiais. Juntas, são um dos maiores desafios de Jomasio.",
    location: "Jomasio",
    attacks: ["Fúria Solar", "Maré Lunar", "Tempestade Estelar"],
  },
  manim: {
    npcType: "manim",
    name: "Manim",
    description:
      "Um ser misterioso que fala por enigmas. Sua forma física é tão enganosa quanto suas palavras.",
    location: "Jomasio",
    attacks: ["Ilusão", "Toque Dimensional"],
  },
  maurao: {
    npcType: "maurao",
    name: "Maurão",
    description:
      "Um brutamonte que aterroriza os arredores de Jomasio. Corpo enorme e pouca paciência.",
    location: "Jomasio",
    attacks: ["Pisão", "Braçada"],
  },
  maugrelo: {
    npcType: "maugrelo",
    name: "Maugrelo",
    description:
      "O irmão mais novo de Maurão. Magro mas traiçoeiro, ataca com golpes rápidos e venenosos.",
    location: "Jomasio",
    attacks: ["Golpe Venenoso", "Ataque Rápido"],
  },

  /* ── Bocaina ── */
  hungryDog: {
    npcType: "hungryDog",
    name: "Cachorro Faminto",
    description:
      "Cães abandonados que se uniram em matilhas famintas. Atacam qualquer um que entre em seu território.",
    location: "Bocaina",
    attacks: ["Mordida Canina", "Ataque em Matilha"],
  },
  lupita: {
    npcType: "lupita",
    name: "Lupita",
    description:
      "A líder da matilha de Bocaina. Uma loba gigante com cicatrizes de inúmeras batalhas.",
    location: "Bocaina",
    attacks: ["Uivo Aterrorizante", "Mordida Sanguinária", "Garra Cortante"],
  },
  riquelsonDog: {
    npcType: "riquelsonDog",
    name: "Cachorro de Riquelson",
    description:
      "O cão de guarda de Riquelson, um dos moradores mais excêntricos de Bocaina. Fiel e mortal.",
    location: "Bocaina",
    attacks: ["Latido Intimidador", "Investida Protetora"],
  },
  baiano: {
    npcType: "baiano",
    name: "Baiano",
    description:
      "Um capoeirista habilidoso que defende Bocaina com seus movimentos acrobáticos.",
    location: "Bocaina",
    attacks: ["Rasteira", "Chute de Capoeira", "Ginga"],
  },
  spiritMotocycler: {
    npcType: "spiritMotocycler",
    name: "Motoqueiro Fantasma",
    description:
      "A lenda de Bocaina — um motoqueiro que morreu em um acidente e agora assombra as estradas.",
    location: "Bocaina",
    attacks: ["Atropelamento Fantasma", "Escapamento Flamejante"],
  },
  tim: {
    npcType: "tim",
    name: "Tim",
    description:
      "Um assassino ágil que pula e faz acrobacias com duas facas de sashimi. Cultista de Baal.",
    location: "Bocaina",
    attacks: ["Facada Acrobática", "Salto Mortal", "Chuva de Lâminas"],
  },
  muyMacho: {
    npcType: "muyMacho",
    name: "Muy Macho",
    description:
      "Um lutador de luta livre mexicano que perdeu o rumo. Agora vagueia por Bocaina em busca de oponentes.",
    location: "Bocaina",
    attacks: ["Máscara Voadora", "Queda Livre", "Abraço de Urso"],
  },

  /* ── Lagoa Grande ── */
  hungryFish: {
    npcType: "hungryFish",
    name: "Peixe Faminto",
    description:
      "Peixes mutantes que cresceram demais após se alimentarem de rejeitos químicos na Lagoa Grande.",
    location: "Lagoa Grande",
    attacks: ["Mordida Aquática", "Caudada"],
  },
  hungryCow: {
    npcType: "hungryCow",
    name: "Vaca Faminta",
    description:
      "Gado enlouquecido que pasta nas margens da Lagoa Grande. Seus olhos vermelhos não enganam.",
    location: "Lagoa Grande",
    attacks: ["Coice", "Investida"],
  },
  fischer: {
    npcType: "fischer",
    name: "Fischer",
    description:
      "Um pescador solitário que passou tempo demais no sol. Sua sanidade já foi embora há muito tempo.",
    location: "Lagoa Grande",
    attacks: ["Rede Enroscante", "Anzol Envenenado"],
  },
  monsterOfNessRiver: {
    npcType: "monsterOfNessRiver",
    name: "Monstro do Rio Ness",
    description:
      "A criatura lendária que habita as profundezas do Rio Ness em Lagoa Grande. Poucos viram e sobreviveram.",
    location: "Lagoa Grande",
    attacks: ["Cauda Torrencial", "Mergulho Abissal", "Jato d'Água"],
  },

  /* ── Cachoeiras ── */
  figurantOfBaalCult: {
    npcType: "figurantOfBaalCult",
    name: "Figurante do Culto de Baal",
    description:
      "Membros rasos do culto a Baal. Vestem mantos negros e repetem mantras sem entender o significado.",
    location: "Cachoeiras",
    attacks: ["Golpe de Adaga", "Maldição Menor"],
  },
  baal: {
    npcType: "baal",
    name: "Baal",
    description:
      "O líder do culto das Cachoeiras. Dizem que ele fez um pacto com um demônio ancestral.",
    location: "Cachoeiras",
    attacks: ["Chama Negra", "Invocar Seguidores", "Olhar do Abismo"],
  },
  madame: {
    npcType: "madame",
    name: "Madame",
    description:
      "Uma aranha gigante do tamanho de um cão de caça. Ela tece teias nas árvores das Cachoeiras.",
    location: "Cachoeiras",
    attacks: ["Teia Pegajosa", "Picada Venenosa", "Patas Cortantes"],
  },

  /* ── Barragem ── */
  figurantOfMobyDickCult: {
    npcType: "figurantOfMobyDickCult",
    name: "Figurante do Culto de Moby Dick",
    description:
      "Seguidores fanáticos que cultuam a baleia branca. Usam arpões e cantos hipnóticos.",
    location: "Barragem",
    attacks: ["Arpoada", "Canto Hipnótico"],
  },
  crocodile: {
    npcType: "crocodile",
    name: "Crocodilo",
    description:
      "Crocodilos da Barragem — predadores de emboscada que atacam rápido e arrastam para a água.",
    location: "Barragem",
    attacks: ["Boca de Aço", "Caudaço", "Rolagem Mortal"],
  },
  elitCrocodile: {
    npcType: "elitCrocodile",
    name: "Crocodilo de Elite",
    description:
      "Crocodilos maiores e mais espertos que guardam os acessos mais profundos da Barragem.",
    location: "Barragem",
    attacks: ["Boca de Aço", "Caudaço", "Rolagem Mortal", "Escudo de Escamas"],
  },
  mobyDick: {
    npcType: "mobyDick",
    name: "Moby Dick",
    description:
      "A lendária baleia branca que aterroriza a Barragem. Dizem que é imortal.",
    location: "Barragem",
    attacks: ["Jato Colossal", "Cauda do Juízo", "Mergulho Profundo"],
  },
  yangKai: {
    npcType: "yangKai",
    name: "Yang Kai",
    description:
      "Um cultivador misterioso que apareceu na Barragem. Seu poder é de outro mundo.",
    location: "Barragem",
    attacks: ["Corte de Qi", "Palma da Montanha", "Explosão Espiritual"],
  },

  /* ── Tanque dos Crávos ── */
  figurantOfDragonKingCult: {
    npcType: "figurantOfDragonKingCult",
    name: "Figurante do Culto do Rei Dragão",
    description:
      "Devotos do Rei Dragão. Usam escamas de dragão como armadura e cospem fogo fraco.",
    location: "Tanque dos Crávos",
    attacks: ["Sopro Rasteiro", "Lança de Escama"],
  },
  ains: {
    npcType: "ains",
    name: "Ains",
    description:
      "Um ser de poder incomparável. Dizem que veio de outro mundo — um verdadeiro OVERLORD.",
    location: "Tanque dos Crávos",
    attacks: ["Magia Negra", "Toque da Morte", "Dominação"],
  },
  dragonKing: {
    npcType: "dragonKing",
    name: "Rei Dragão",
    description:
      "O lendário Rei Dragão que governa o Tanque dos Crávos. A criatura mais poderosa já vista.",
    location: "Tanque dos Crávos",
    attacks: ["Hálito de Fogo", "Asa Cortante", "Fúria do Dragão Rei"],
  },

  /* ── Lagoa do Canto ── */
  hungryPig: {
    npcType: "hungryPig",
    name: "Porco Faminto",
    description:
      "Porcos selvagens que reviram a terra em busca de comida. Agressivos quando provocados.",
    location: "Lagoa do Canto",
    attacks: ["Chifrada", "Pisoteio"],
  },
  technoblade: {
    npcType: "technoblade",
    name: "Technoblade",
    description:
      "Uma lenda viva. O guerreiro mais temido de todos os tempos. Ele nunca morre.",
    location: "Lagoa do Canto",
    attacks: ["Lâmina da Lenda", "Grito de Guerra", "Golpe do Herói"],
  },
};

export const BESTIARY_NPC_ORDER: string[] = Object.keys(BESTIARY_DATA);
