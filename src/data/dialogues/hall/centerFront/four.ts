import { npcPath } from "@/utils/paths";

export const centerFrontFourDialogue = [
  {
    src: npcPath("/leo/right.svg"),
    name: "Léo",
    message: "M-N Celo",
  },
  {
    isPlayer: true,
    name: "Protagonista",
    message: "M-N Léo",
    expression: "crossArms",
  },
  {
    src: npcPath("/leo/point.svg"),
    name: "Léo",
    message: "Nei",
  },
];
