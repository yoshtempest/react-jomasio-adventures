import { npcPath } from "@/utils/paths";

export const pcsRoomTwoDialogue = [
  {
    isPlayer: true,
    name: "Protagonista",
    message: "Ué, cadê Juan Derson?",
    expression: "crossArms"
  },
  {
    isPlayer: true,
    name: "Protagonista",
    message: "Calma ai, ele tá comendo um mouse?",
    expression: "why"
  },
  {
    src: npcPath("/hungryDeath/right.svg"),
    name: "Morto de fome",
    message: "Huhuhu, achei um almoço aqui, carne de rato!",
  },
  {
    isPlayer: true,
    name: "Protagonista",
    message: "Cara isso num é comida não, macho!",
    expression: "crossArms"
  },
  {
    src: npcPath("/hungryDeath/default.svg"),
    name: "Morto de fome",
    message: "Sai daqui, eu não vou dividir meu almoço com você!",
  },
  {
    isPlayer: true,
    name: "Protagonista",
    message: "Eu não quero brigar cara, eu não tenho inimigos.",
    expression: "ops"
  },
  {
    src: npcPath("/hungryDeath/right.svg"),
    name: "Morto de fome",
    message: "Eu vou te comer então seu bosta! Vem aqui!",
  },
];
