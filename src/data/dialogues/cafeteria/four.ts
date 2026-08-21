import { npcPath } from "@/utils/paths";

export const cafeteriaFourDialogue = [
  {
    src: npcPath("/denis/tranks.svg"),
    name: "Denis",
    message: "PEGA LÁ ANTES QUE EU DESINTEGRE VOCÊ TAMBÉM",
  },
  {
    isPlayer: true,
    name: "Protagonista",
    message: "tá",
    expression: "hungry",
  },
] satisfies Dialogue[];
