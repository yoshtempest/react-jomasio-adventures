import { npcPath } from "@/utils/paths";

export const HellRoomFourDialogue = [
  {
    src: npcPath("/kidBengala/terror.svg"),
    name: "Kid Bengala",
    message:
      "Aaah, Maugrelooo, por que foges? A noite é apenas uma criança hahaahaha",
  },
  {
    isPlayer: true,
    name: "Protagonista",
    message: "MEU JESUS AMADO, OLHA O TAMANHO...",
    expression: "disgust",
  },
  {
    src: npcPath("/maugrelo/right.svg"),
    name: "Maugrelo",
    message: "Não Kid, SAI DE PERTO, NÃO ME TOCA",
  },
  {
    src: npcPath("/reincardion/right.svg"),
    name: "Reincardion",
    message: "Vamos embora daqui tesouro, não fique com essa gentalha",
  },
  {
    isPlayer: true,
    name: "Protagonista",
    message: "Ué, quem é você mesmo?",
    expression: "crossArms",
  },
  {
    src: npcPath("/reincardion/right.svg"),
    name: "Reincardion",
    message: "Não há tempo para perguntas, vamos embora daqui!",
  },
] satisfies Dialogue[];
