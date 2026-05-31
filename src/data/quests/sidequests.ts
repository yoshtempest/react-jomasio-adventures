import type { Quest } from "@/utils/types/player/quest";

export const SIDE_QUESTS: Record<string, Quest> = {
    give_orange_juice: {
        id: "give_orange_juice",
        name: "Dê o suco de laranja",
        image: "/assets/npcs/jailson/default.svg",
        description: "Agora eu to a fim de relaxar, me traga um suco de laranja.",
        rewardsType: "xp",
        rewards: 40,
        type: "sidequest",
        counter: 1,
        progress: 0,
        completed: false
    },
    create_map: {
        id: "create_map",
        name: "Preciso de uma peça",
        image: "/assets/npcs/jailson/default.svg",
        description: "Se você me trouxer a peça que eu quero, eu faço um mapa pra você",
        rewardsType: "xp",
        rewards: 40,
        type: "sidequest",
        counter: 1,
        progress: 0,
        completed: false
    },
    get_suspect_milk: {
        id: "get_suspect_milk",
        name: "Pegue o leite suspeito",
        image: "/assets/npcs/juju/right.svg",
        description: "Quero fazer um bolo com aquele leite bovino",
        rewardsType: "xp",
        rewards: 40,
        type: "sidequest",
        counter: 1,
        progress: 0,
        completed: false
  },
} as const;