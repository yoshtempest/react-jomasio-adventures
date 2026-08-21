import { npcPath } from "@/utils/paths";

export const HallPandemonyDialogue = [
  {
    src: npcPath("/maurao/good.svg"),
    name: "Maurão",
    message: "Estou ficando louca, hahahaha",
  },
  {
    isPlayer: true,
    name: "Protagonista",
    message: "Posso te ajudar?",
    expression: "crossArms",
  },
  {
    src: npcPath("/maurao/right.svg"),
    name: "Maurão",
    message: "Bebi o fim de semana INTEIRO, HAHAHAHAH",
  },
  {
    isPlayer: true,
    name: "Protagonista",
    message: "Credo, então o problema é a ressaca?",
    expression: "crossArms",
  },
  {
    src: npcPath("/maurao/crazying.svg"),
    name: "Maurão",
    message: "Os remédios não funcionam kkkkkkkkkkk",
  },
  {
    isPlayer: true,
    name: "Protagonista",
    message: "O que você quer então?",
    expression: "why",
  },
  {
    src: npcPath("/maurao/default.svg"),
    name: "Maurão",
    message: "VAMOS LUTAR!",
  },
  {
    isPlayer: true,
    name: "Protagonista",
    message: "Por que?",
    expression: "why",
  },
  {
    src: npcPath("/maurao/default.svg"),
    name: "Maurão",
    message: "NÃO PRECISA DE MOTIVO HAHAHAHA!",
  },
] satisfies Dialogue[];
