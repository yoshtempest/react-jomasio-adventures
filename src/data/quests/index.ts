export const QUESTS = {
  explore_jorjao: {
    id: "explore_jorjao",
    name: "Foi uma delicia",
    image: "/src/assets/npcs/jhowsimar/default.svg",
    description: "Dúvido você ir lá na sala dos pcs.",
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
    counter: 1,
    progress: 0,
    completed: false
  }
} as const;

export type QuestId = keyof typeof QUESTS;