export const QUESTS = {
  jomasio_investigate: {
    id: "jomasio_investigate",
    name: "Investigação do SETH Jorjão",
    image: "/assets/npcs/duqueC/default.svg",
    description: "Investigue a falta de comida no SETH Jorjão",
    rewardsType: "xp",
    rewards: 10,
    type: "history",
    counter: 1,
    progress: 0,
    completed: false
  },
  director_escape: {
    id: "director_escape",
    name: "Fuja da diretoria",
    image: "/assets/npcs/system/default.svg",
    description: "Procure uma forma de sair da diretoria",
    type: "history",
    rewardsType: "xp",
    rewards: 10,
    counter: 1,
    progress: 0,
    completed: false
  },
  explore_jorjao: {
    id: "explore_jorjao",
    name: "Foi uma delicia",
    image: "/assets/npcs/jhowsimar/default.svg",
    description: "Vá na sala dos pcs para superar o 'dúvido' de Jhow Simar",
    type: "history",
    rewardsType: "xp",
    rewards: 10,
    counter: 1,
    progress: 0,
    completed: false
  },
  x1_jhowsimar: {
    id: "x1_jhowsimar",
    name: "Vem pro fight",
    image: "/assets/npcs/jhowsimar/right.svg",
    description: "Tire o X1 com Jhow Simar para ganhar seu bolsa delicia",
    type: "history",
    rewardsType: "coin",
    rewards: 100,
    counter: 1,
    progress: 0,
    completed: false
  },
  x1_hungry: {
    id: "x1_hungry",
    name: "Vem pro fight",
    image: "/assets/npcs/hungryDeath/right.svg",
    description: "Tire o X1 com morto de fome para ganhar seu bolsa delicia",
    type: "history",
    rewardsType: "coin",
    rewards: 100,
    counter: 1,
    progress: 0,
    completed: false
  },
  x1_deise: {
    id: "x1_deise",
    name: "Vem pro fight",
    image: "/assets/npcs/deise/right.svg",
    description: "Tire o X1 com Deise para ganhar seu bolsa delicia",
    type: "history",
    rewardsType: "coin",
    rewards: 100,
    counter: 1,
    progress: 0,
    completed: false
  },
  search_packaging: {
    id: "search_packaging",
    name: "Entrega suspeita",
    image: "/assets/npcs/remedinha/default.svg",
    description: "Vá na biblioteca e traga a embalagem suspeita para Remedinha.",
    rewardsType: "xp",
    rewards: 10,
    type: "history",
    counter: 1,
    progress: 0,
    completed: false
  },
  go_cafeteria: {
    id: "go_cafeteria",
    name: "Ir em busca do linguição",
    image: "/assets/npcs/remedinha/default.svg",
    description: "Vá ao no refeitório e adquira sua recompensa (linguição)",
    type: "history",
    counter: 1,
    progress: 0,
    completed: false
  },
  return_to_remedinha: {
    id: "return_to_remedinha",
    name: "Contar a fofoca do dia",
    image: "/assets/npcs/remedinha/default.svg",
    description: "Volte e reporte a Remedinha sobre o ocorrido no refeitório",
    rewardsType: "xp",
    rewards: 10,
    type: "history",
    counter: 1,
    progress: 0,
    completed: false
  },
  encounter_deise: {
    id: "encounter_deise",
    name: "Nunca me encontre",
    image: "/assets/npcs/deise/default.svg",
    description: "Vá ao Tanque dos Cravos",
    rewardsType: "xp",
    rewards: 100,
    type: "history",
    counter: 1,
    progress: 0,
    completed: false
  },
  go_to_hell: {
    id: "go_to_hell",
    name: "Encontre Negão do Ferro Velho",
    image: "/assets/npcs/remedinha/default.svg",
    description: "Vá aos corredores escuros em busca de falar com o Negão",
    rewardsType: "xp",
    rewards: 40,
    type: "history",
    counter: 1,
    progress: 0,
    completed: false
  },
} as const;

export type QuestId = keyof typeof QUESTS;