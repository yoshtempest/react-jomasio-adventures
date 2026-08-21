import { npcPath } from "@/utils/paths";

export const HellRoomDialogue = [
  {
    src: npcPath("/peruFather/right.svg"),
    name: "Homem desconhecido",
    message: "Ei você ai",
  },
  {
    isPlayer: true,
    name: "Protagonista",
    message: "Que? Eu estava prestes a descer a mão naquele cara...",
    expression: "crossArms",
  },
  {
    src: npcPath("/peruFather/right.svg"),
    name: "Homem desconhecido",
    message: "Cara, eu tô falando com você, desgraçado!",
  },
  {
    isPlayer: true,
    name: "Protagonista",
    message: "Quer brigar?",
    expression: "x1",
  },
  {
    src: npcPath("/peruFather/right.svg"),
    name: "Homem desconhecido",
    message: "Não cara, eu não sei brigar, calma ai",
  },
  {
    isPlayer: true,
    name: "Protagonista",
    message: "Então me diz, onde estamos?",
    expression: "why",
  },
  {
    src: npcPath("/peruFather/right.svg"),
    name: "Homem desconhecido",
    message:
      "Não há tempo para perguntas, por favor me responda uma coisa RÁPIDO!",
  },
  {
    isPlayer: true,
    name: "Protagonista",
    message: "O que?",
    expression: "crossArms",
  },
  {
    src: npcPath("/peruFather/right.svg"),
    name: "Homem desconhecido",
    message: "Você gosta de cavalgar no Peru?",
  },
] satisfies Dialogue[];
