import { npcPath } from "@/utils/paths";

export const hallJailsonThreeDialogue = [
  {
    src: npcPath("/slimita/right.svg"),
    name: "Slimita",
    message:
      "Não pense que vai ficar por isso, eu vou pegar o Jailson pra mim, custe o que custar!",
  },
  {
    isPlayer: true,
    name: "Protagonista",
    message: "Porque todo personagem que perde para mim sobrevive e foge?",
    expression: "why"
  },
  {
    src: npcPath("/jailson/right.svg"),
    name: "Jailson",
    message: "Estranho né...",
  },
] satisfies Dialogue[];
