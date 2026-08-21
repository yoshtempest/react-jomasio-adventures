import { npcPath } from "@/utils/paths";

export const AfterPcRoomSevenDialogue = [
  {
    isPlayer: true,
    name: "Protagonista",
    message: "Salvei o Jailson",
    expression: "talking"
  },
  {
    src: npcPath("/remedinha/right.svg"),
    name: "Remedinha",
    message: "Muito bem",
  },
  {
    isPlayer: true,
    name: "Protagonista",
    message: "?",
    expression: "crossArms"
  },
  {
    src: npcPath("/remedinha/right.svg"),
    name: "Remedinha",
    message: "Tá olhando o que?",
  },
  {
    isPlayer: true,
    name: "Protagonista",
    message: "Você não vai me dar outra missão e algum item como recompensa?",
    expression: "crossArms"
  },
  {
    src: npcPath("/remedinha/right.svg"),
    name: "Remedinha",
    message: "Tá achando que eu sou uma guia é?",
  },
  {
    isPlayer: true,
    name: "Protagonista",
    message: "É, me diga o próximo passo",
    expression: "crossArms"
  },
  {
    src: npcPath("/remedinha/right.svg"),
    name: "Remedinha",
    message:
      "Vai lá nos corredores e procura por um tal de Negão do Ferro Velho",
  },
  {
    isPlayer: true,
    name: "Protagonista",
    message: "Tá achando que sou doido?",
    expression: "crossArms"
  },
  {
    src: npcPath("/remedinha/right.svg"),
    name: "Remedinha",
    message: "Sim",
  },
  {
    isPlayer: true,
    name: "Protagonista",
    message: "Tá, vou jogar esse seu joguinho",
    expression: "crossArms"
  },
] satisfies Dialogue[];
