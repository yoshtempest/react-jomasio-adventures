import { npcPath } from "@/utils/paths";

export const hallJailsonTwoDialogue = [
  {
    src: npcPath("/slimita/right.svg"),
    name: "Slimita",
    message: "A mas você vai me dar isso sim, Jailson!",
  },
  {
    src: npcPath("/jailson/right.svg"),
    name: "Jailson",
    message: "Não, não vou, Slimita! Você não faz o meu tipo",
  },
  {
    isPlayer: true,
    name: "Protagonista",
    message: "Slimita, eu não vou deixar você fazer isso com o Jailson!",
    expression: "x1"
  },
  {
    src: npcPath("/slimita/right.svg"),
    name: "Slimita",
    message: "Então vem pra cima garoto, vem!",
  },
  {
    isPlayer: true,
    name: "Protagonista",
    message: "Como assim caralho?",
    soundSrc: "/assets/songs/soundEffects/player/howYouSaid.mp3",
    expression: "rascal",
  },
  {
    src: npcPath("/slimita/right.svg"),
    name: "Slimita",
    message: "Ui, tá com medo é? Eu vou devorar o Jailson e fazer dele a minha força!",
  },
  {
    isPlayer: true,
    name: "Protagonista",
    message:
      "Ah tá, achei que era outra coisa, mas se é isso que você quer, então vamos lutar!",
    expression: "x1"
  },
];
