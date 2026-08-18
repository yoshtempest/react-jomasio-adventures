import { npcPath } from "@/utils/paths";

export const HallLeftTwoDialogue = [
  {
    isPlayer: true,
    name: "Protagonista",
    message: "Vocês tem aura essa semana?",
    expression: "crossArms"
  },
  {
    src: npcPath("/mariMarques/right.svg"),
    name: "Irmãs Planetárias",
    message: "Têmos muita aura",
  },
  {
    isPlayer: true,
    name: "Protagonista",
    message: "Posso passar? tenho que falar com os manos alí",
    expression: "talking"
  },
  {
    src: npcPath("/mariMarques/right.svg"),
    name: "Irmãs Planetárias",
    message: "Estamos presas aqui, se você conseguir passar, meus parabéns",
  },
  {
    isPlayer: true,
    name: "Protagonista",
    message:
      "Era para vocês estarem dando aura e ficaram presas na porta kkkkkkkkk",
    expression: "happy"
  },
  {
    src: npcPath("/mariMarques/right.svg"),
    name: "Irmãs Planetárias",
    message: "Era zueira, vamos ver quem tem mais aura em uma luta agora!",
  },
];
