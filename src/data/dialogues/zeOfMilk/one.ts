import { npcPath } from "@/utils/paths";

export const zeOfMilkDialogue = [
  {
    src: npcPath("/zeOfMilk/right.svg"),
    name: "zeOfMilk",
    message: "TU NÃO VAI ACREDITAR, VAZOU UM VÍDEO MEU E TODO MUNDO TÁ SABENDO",
  },
  {
    isPlayer: true,
    name: "Protagonista",
    message: "Eu não sei de nada",
  },
  {
    src: npcPath("/zeOfMilk/right.svg"),
    name: "zeOfMilk",
    message:
      "ESQUECE O QUE EU DISSE E VAI LÁ EM TIM PEGAR O LEITE QUE EU DEIXEI LÁ",
  },
  {
    isPlayer: true,
    name: "Protagonista",
    message: "Tá",
  },
] satisfies Dialogue[];
