import { npcPath, playerPath } from "@/utils/paths";

export const footballCourtTwoDialogue = [
  {
    src: npcPath("/neimito/right.svg"),
    name: "Neimito",
    message: "Nada haver o que você fez comigo, eu queria algo diferente",
  },
  {
    src: playerPath("/emanuel/default.svg"),
    name: "Ematron",
    message: "Eu me lembro de tudo",
  },
  {
    isPlayer: true,
    name: "Protagonista",
    message: "Vamos embora Ematron, não se junte com essa gentalha",
    expression: "crossArms",
  },
];
