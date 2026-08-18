import { npcPath } from "@/utils/paths";

export const pcsRoomFourDialogue = [
  {
    src: npcPath("/vandinhaFragment/right.svg"),
    name: "Fragmento de Vandinha",
    message: "Foi você que bateu no meu bêbê, não foi?",
  },
  {
    isPlayer: true,
    name: "Protagonista",
    message: "Aquele de agora a pouco?",
    expression: "crossArms"
  },
  {
    src: npcPath("/vandinhaFragment/default.svg"),
    name: "Fragmento de Vandinha",
    message: "EU SABIA! ESTOU DE OLHO EM VOCÊ A MUITO TEMPO!",
  },
];
