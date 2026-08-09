import { npcPath } from "@/utils/paths";

export const AfterPcRoomFourDialogue = [
  {
    src: npcPath("/remedinha/right.svg"),
    name: "Remedinha",
    message: "Fique com isso",
  },
  {
    src: npcPath("/remedinha/right.svg"),
    name: "Remedinha",
    message: "Utilize para batalhar infinitamente com aqueles rapazes famintos",
  },
  {
    name: "Sistema",
    message: "Você obteve um pó misterioso",
  },
  {
    isPlayer: true,
    name: "Protagonista",
    message: "O que é isso?",
  },
  {
    src: npcPath("/remedinha/right.svg"),
    name: "Remedinha",
    message: "Não faça perguntas",
  },
];
