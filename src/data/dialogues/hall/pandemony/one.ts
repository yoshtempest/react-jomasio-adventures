import { defineDialogue } from "@/data/dialogues/defineDialogue";

export const HallPandemonyDialogue = defineDialogue([
  { who: "maurao", message: "Estou ficando louca, hahahaha", pose: "good" },
  ["protagonista", "Posso te ajudar?", "crossArms"],
  { who: "maurao", message: "Bebi o fim de semana INTEIRO, HAHAHAHAH", pose: "right" },
  ["protagonista", "Credo, então o problema é a ressaca?", "crossArms"],
  { who: "maurao", message: "Os remédios não funcionam kkkkkkkkkkk", pose: "crazying" },
  ["protagonista", "O que você quer então?", "why"],
  ["maurao", "VAMOS LUTAR!"],
  ["protagonista", "Por que?", "why"],
  ["maurao", "NÃO PRECISA DE MOTIVO HAHAHAHA!"],
]);
