import { npcPath } from "@/utils/paths";

export const cantinaBrothersDialogue = [
  {
    src: npcPath("/brothers1/right.svg"),
    name: "???",
    message: "Não sabia que podia vir pra escola armado",
  },
  {
    src: npcPath("/brothers2/right.svg"),
    name: "???",
    message: "Como assim?",
  },
  {
    src: npcPath("/brothers1/right.svg"),
    name: "???",
    message: "E essa pistolona ai no meio de tuas pernas é o que?",
  },
  {
    isPlayer: true,
    name: "Protagonista",
    message: "Que delícia em",
  },
];
