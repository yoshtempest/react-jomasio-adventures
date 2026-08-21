import { npcPath } from "@/utils/paths";

export const AfterPcRoomEightDialogue = [
  {
    isPlayer: true,
    name: "Protagonista",
    message: "Eu vi coisas que gostaria de desver...",
  },
  {
    src: npcPath("/remedinha/right.svg"),
    name: "Remedinha",
    message: "Quem?",
  },
  {
    isPlayer: true,
    name: "Protagonista",
    message: "Eu ué",
  },
  {
    src: npcPath("/remedinha/right.svg"),
    name: "Remedinha",
    message: "Te perguntou? Otário kkkkkkkk",
  },
  {
    isPlayer: true,
    name: "Protagonista",
    message: "Tá chato já",
  },
  {
    src: npcPath("/remedinha/right.svg"),
    name: "Remedinha",
    message: "Nunca fica chato",
  },
  {
    isPlayer: true,
    name: "Protagonista",
    message: "...",
  },
  {
    src: npcPath("/remedinha/right.svg"),
    name: "Remedinha",
    message:
      "Vou passar uma missão aqui, se quiser prosseguir na história tem que fazer",
  },
  {
    isPlayer: true,
    name: "Protagonista",
    message: "Diga",
  },
  {
    src: npcPath("/remedinha/right.svg"),
    name: "Remedinha",
    message:
      "Eu quero que você se infiltre no conselho dos brodi para obter informações, lá você vai encontrar outras pessoas como você",
  },
  {
    isPlayer: true,
    name: "Protagonista",
    message: "Vambora então",
  },
] satisfies Dialogue[];
