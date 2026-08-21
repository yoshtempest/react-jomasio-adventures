import { npcPath } from "@/utils/paths";

export const drinksBarTwoDialogue = [
  {
    src: npcPath("/zeOfBraga/right.svg"),
    name: "Zé do Braga",
    message: "Geladinha do jeito que eu gosto hahaha!",
  },
  {
    src: npcPath("/zeOfBraga/right.svg"),
    name: "Zé do Braga",
    message: "Valeu ai moleque!",
  },
  {
    isPlayer: true,
    name: "Protagonista",
    message: "E minha recompensa?",
  },
  {
    src: npcPath("/zeOfBraga/right.svg"),
    name: "Zé do Braga",
    message: "A vida não é um morango, GO DRINKING! HAHAHAHA",
  },
] satisfies Dialogue[];
