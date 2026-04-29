export const QUESTS = {
  jomasio_investigate: {
    id: "jomasio_investigate",
    name: "Investigação do SETH Jorjão",
    image: "/src/assets/npcs/duqueC/default.svg",
    description: "Investigue a falta de comida no SETH Jorjão",
    type: "history",
    counter: 1,
    progress: 0,
    completed: false
  },
  director_escape: {
    id: "director_escape",
    name: "Fuja da diretoria",
    image: "/src/assets/npcs/system/default.svg",
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
    image: "/src/assets/npcs/jhowsimar/default.svg",
    description: "Vá na sala dos pcs para superar o 'dúvido' de Jhow Simar",
    type: "history",
    rewardsType: "xp",
    rewards: 10,
    counter: 1,
    progress: 0,
    completed: false
  },
  search_packaging: {
    id: "search_packaging",
    name: "Entrega suspeita",
    image: "/src/assets/npcs/remedinha/default.svg",
    description: "Vá na biblioteca e traga a embalagem suspeita para Remedinha.",
    rewardsType: "xp",
    rewards: 10,
    type: "history",
    counter: 1,
    progress: 0,
    completed: false
  },
  go_cantina: {
    id: "go_cantina",
    name: "Ir em busca do linguição",
    image: "/src/assets/npcs/remedinha/default.svg",
    description: "Vá ao no refeitório e adquira sua recompensa (linguição)",
    type: "history",
    counter: 1,
    progress: 0,
    completed: false
  },
} as const;

export type QuestId = keyof typeof QUESTS;