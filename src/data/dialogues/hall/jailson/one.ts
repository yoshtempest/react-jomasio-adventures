import { npcPath } from "@/utils/paths";

export const hallJailsonOneDialogue = [
  {
    src: npcPath("/jailson/right.svg"),
    name: "Jailson",
    message: "Não garoto, você é muito novo pra isso.",
  },
  {
    isPlayer: true,
    name: "Protagonista",
    message: "Mas eu nem disse nada...",
    expression: "talking"
  },
] satisfies Dialogue[];
