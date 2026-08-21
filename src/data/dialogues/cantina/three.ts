import { npcPath } from "@/utils/paths";

export const cantinaThreeDialogue = [
  {
    isPlayer: true,
    name: "Protagonista",
    message: "Tu é fraco Jhow Simar, tu é fraco.",
    expression: "x1"
  },
  {
    src: npcPath("/jhowsimar/right.svg"),
    name: "Jhow Simar",
    message: "Cara, eu sou o primeiro NPC, tu queria o que?",
  },
  {
    isPlayer: true,
    name: "Protagonista",
    message: "Chora mais",
    expression: "crossArms"
  },
  {
    src: npcPath("/jhowsimar/right.svg"),
    name: "Jhow Simar",
    message: "Vou desaparecer, mas obrigado, foi uma delícia te enfrentar.",
  },
  {
    src: npcPath("/jhowsimar/right.svg"),
    name: "Jhow Simar",
    message:
      "Ah é, minhas últimas palavras... Dúvido você ir lá na sala dos pcs...",
  },
] satisfies Dialogue[];
