import { npcPath } from "@/utils/paths";

export const hallJailsonFiveDialogue = [
  {
    src: npcPath("/jailson/right.svg"),
    name: "Jailson",
    message: "Vai logo enquanto eu estou a fim de relaxar",
  },
  {
    isPlayer: true,
    name: "Protagonista",
    message: "tá bom",
    expression: "crossArms"
  },
] satisfies Dialogue[];
