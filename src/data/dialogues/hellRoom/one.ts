import { defineDialogue } from "@/data/dialogues/defineDialogue";

export const HellRoomDialogue = defineDialogue([
  ["homemDesconhecido", "Ei você ai"],
  [
    "protagonista",
    "Que? Eu estava prestes a descer a mão naquele cara...",
    "crossArms",
  ],
  ["homemDesconhecido", "Cara, eu tô falando com você, desgraçado!"],
  ["protagonista", "Quer brigar?", "x1"],
  ["homemDesconhecido", "Não cara, eu não sei brigar, calma ai"],
  ["protagonista", "Então me diz, onde estamos?", "why"],
  [
    "homemDesconhecido",
    "Não há tempo para perguntas, por favor me responda uma coisa RÁPIDO!",
  ],
  ["protagonista", "O que?", "crossArms"],
  ["homemDesconhecido", "Você gosta de cavalgar no Peru?"],
]);
