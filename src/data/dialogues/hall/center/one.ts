import { npcPath } from "@/utils/paths";

export const centerDialogue = [
  {
    src: npcPath("/planetarySisters/mary.svg"),
    name: "Maria",
    message: "Eita irmã, essa porta é...",
  },
  {
    src: npcPath("/planetarySisters/nelit.svg"),
    name: "Maria 2",
    message: "Pequena em",
  },
  {
    isPlayer: true,
    name: "Protagonista",
    message: "E agora? Como que eu passo?",
    expression: "crossArms",
  },
  {
    src: npcPath("/planetarySisters/mary.svg"),
    name: "Maria",
    message: "Dá teu...",
  },
  {
    src: npcPath("/planetarySisters/nelit.svg"),
    name: "Maria 2",
    message: "Jeito",
  },
  {
    isPlayer: true,
    name: "Protagonista",
    message: "Então eu vou acabar com vcs e passar",
    expression: "x1",
  },
  {
    src: npcPath("/planetarySisters/mary.svg"),
    name: "Maria",
    message: "Calma ai",
  },
  {
    src: npcPath("/planetarySisters/nelit.svg"),
    name: "Maria 2",
    message: "Não precisa dessa violência",
  },
  {
    isPlayer: true,
    name: "Protagonista",
    message: "E como que eu passo?",
    expression: "crossArms",
  },
  {
    src: npcPath("/planetarySisters/mary.svg"),
    name: "Maria",
    message: "Não passa",
  },
  {
    isPlayer: true,
    name: "Protagonista",
    message: "Então vou espancar vocês",
    expression: "x1",
  },
  {
    src: npcPath("/planetarySisters/mary.svg"),
    name: "Maria",
    message: "Vamo ver...",
  },
  {
    src: npcPath("/planetarySisters/nelit.svg"),
    name: "Maria 2",
    message: "Quem vai levar a melhor",
  },
] satisfies Dialogue[];
