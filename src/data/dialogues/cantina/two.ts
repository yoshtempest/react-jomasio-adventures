import { npcPath } from "@/utils/paths";

export const cantinaTwoDialogue = [
  {
    src: npcPath("/jhowsimar/sleeping.svg"),
    name: "Jhow Simar",
    message: "Zzzz...",
  },
  {
    isPlayer: true,
    name: "Protagonista",
    message: "Eu já sai da diretoria, bora brigar?",
  },
  {
    src: npcPath("/jhowsimar/wakingUp.svg"),
    name: "Jhow Simar",
    message: "Hm?",
  },
  {
    src: npcPath("/jhowsimar/right.svg"),
    name: "Jhow Simar",
    message: "Como que cê saiu?",
  },
  {
    isPlayer: true,
    name: "Protagonista",
    message: "Eu usei a chave uaí",
  },
  {
    src: npcPath("/jhowsimar/right.svg"),
    name: "Jhow Simar",
    message: "Ah, eu esqueci de levar a chave comigo",
  },
  {
    isPlayer: true,
    name: "Protagonista",
    message: "Relaxa, tem nada não",
  },
  {
    src: npcPath("/jhowsimar/right.svg"),
    name: "Jhow Simar",
    message: "A gente não era para estar brigando?",
  },
  {
    isPlayer: true,
    name: "Protagonista",
    message: "Eu não tenho inimigos",
  },
  {
    src: npcPath("/jhowsimar/right.svg"),
    name: "Jhow Simar",
    message: "Mas eu tenho, vem cá vem",
  },
];
