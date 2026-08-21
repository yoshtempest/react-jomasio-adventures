import { npcPath } from "@/utils/paths";

export const drinksBarDialogue = [
  {
    src: npcPath("/zeOfBraga/right.svg"),
    name: "Zé do Braga",
    message: "Quando eu tinha a sua idade eu vivia roubando galinha, hahaha",
  },
  {
    src: npcPath("/zeOfBraga/right.svg"),
    name: "Zé do Braga",
    message: "Pega uma skool lá para mim moleque",
  },
  {
    isPlayer: true,
    name: "Protagonista",
    message: "Tá",
  },
] satisfies Dialogue[];
