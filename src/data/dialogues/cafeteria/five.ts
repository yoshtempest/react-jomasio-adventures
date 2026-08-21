import { npcPath } from "@/utils/paths";

export const cafeteriaFiveDialogue = [
  {
    src: npcPath("/denis/tranks.svg"),
    name: "Denis",
    message: "Pronto, obrigado",
  },
  {
    isPlayer: true,
    name: "Protagonista",
    message: "Posso ir embora agora?",
    expression: "crossArms",
  },
  {
    src: npcPath("/denis/tranks.svg"),
    name: "Denis",
    message: "Faz o que quiser, a porta nem tava trancada",
  },
  {
    isPlayer: true,
    name: "Protagonista",
    message: "AAAA MALDITO!",
    expression: "desperate",
  },
  {
    src: npcPath("/denis/tranks.svg"),
    name: "Denis",
    message: "Tchau",
  },
] satisfies Dialogue[];
