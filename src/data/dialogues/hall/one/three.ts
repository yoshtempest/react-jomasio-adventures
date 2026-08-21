import { npcPath } from "@/utils/paths";

export const AfterPcRoomThreeDialogue = [
  {
    src: npcPath("/remedinha/right.svg"),
    name: "Remedinha",
    message: "Era essa a surpresinha que eu queria!! Quer saber o que é?",
  },
  {
    isPlayer: true,
    name: "Protagonista",
    message: "Diga",
    expression: "crossArms"
  },
  {
    src: npcPath("/remedinha/right.svg"),
    name: "Remedinha",
    message:
      "Vai ficar curioso, até o fim do jogo você não vai descobrir o que é",
  },
] satisfies Dialogue[];
