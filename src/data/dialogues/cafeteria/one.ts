import { npcPath } from "@/utils/paths";

export const cafeteriaDialogue = [
  {
    src: npcPath("/deise/right.svg"),
    name: "Deise",
    message: "Tá achando que é quem para entrar em minha expansão de domínio?",
  },
  {
    isPlayer: true,
    name: "Protagonista",
    message: "Quê? Eu sou o protagonista ué",
    expression: "crossArms"
  },
  {
    src: npcPath("/deise/right.svg"),
    name: "Deise",
    message: "Isso é o que você pensa!",
  },
] satisfies Dialogue[];
