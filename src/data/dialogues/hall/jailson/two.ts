import { defineDialogue } from "@/data/dialogues/defineDialogue";

export const hallJailsonTwoDialogue = defineDialogue([
  ["slimita", "A mas você vai me dar isso sim, Jailson!"],
  ["jailson", "Não, não vou, Slimita! Você não faz o meu tipo"],
  [
    "protagonista",
    "Slimita, eu não vou deixar você fazer isso com o Jailson!",
    "x1",
  ],
  ["slimita", "Então vem pra cima garoto, vem!"],
  {
    who: "protagonista",
    message: "Como assim caralho?",
    expression: "rascal",
    soundSrc: "/assets/songs/soundEffects/player/howYouSaid.mp3",
  },
  [
    "slimita",
    "Ui, tá com medo é? Eu vou devorar o Jailson e fazer dele a minha força!",
  ],
  [
    "protagonista",
    "Ah tá, achei que era outra coisa, mas se é isso que você quer, então vamos lutar!",
    "x1",
  ],
]);
