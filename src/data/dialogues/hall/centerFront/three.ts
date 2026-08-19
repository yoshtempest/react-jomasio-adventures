import { npcPath } from "@/utils/paths";

export const centerFrontThreeDialogue = [
  {
    src: npcPath("/leo/right.svg"),
    name: "Léo",
    message: "Você gosta do Nei ou do Mar?",
  },
  {
    isPlayer: true,
    name: "Protagonista",
    message: "O que que vc está falando cara?",
    expression: "crossArms",
  },
  {
    src: npcPath("/leo/point.svg"),
    name: "Léo",
    message: "Nei, kkkkkkkkkkkk",
  },
];
