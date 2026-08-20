import { npcPath } from "@/utils/paths";

export const cantinaBrothersDialogue = [
  {
    src: npcPath("/brothers/one.svg"),
    name: "???",
    message: "Não sabia que podia vir pra escola armado",
  },
  {
    src: npcPath("/brothers/two.svg"),
    name: "???",
    message: "Como assim?",
  },
  {
    src: npcPath("/brothers/one.svg"),
    name: "???",
    message: "E essa pistolona ai no meio de tuas pernas é o que?",
  },
  {
    isPlayer: true,
    name: "Protagonista",
    message: "Que delícia em",
    expression: "rascal"
  },
];
