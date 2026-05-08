import type { Quest } from "@/utils/types/player/quest";

type QuestDefinition = Quest & {
  nextQuestId?: string;
  rewardXP: number;
};

export const historyQuests: Record<string, QuestDefinition> = {
  buscar_embalagem: {
    id: "buscar_embalagem",
    name: "Entrega suspeita",
    image: "/assets/npcs/remedinha/default.svg",
    description: "Vá na biblioteca e traga a embalagem suspeita.",
    type: "history",
    counter: 1,
    progress: 0,
    completed: false,

    rewardXP: 20,
    nextQuestId: "falar_com_remedinha",
  },

  falar_com_remedinha: {
    id: "falar_com_remedinha",
    name: "Voltar ao NPC",
    image: "/assets/npcs/remedinha/default.svg",
    description: "Volte e fale com Remedinha.",
    type: "history",
    counter: 1,
    progress: 0,
    completed: false,

    rewardXP: 30,
    nextQuestId: undefined,
  }
};