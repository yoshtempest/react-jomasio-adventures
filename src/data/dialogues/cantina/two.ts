import { defineDialogue } from "@/data/dialogues/defineDialogue";

export const cantinaTwoDialogue = defineDialogue([
  { who: "jhowSimar", message: "Zzzz...", pose: "sleeping" },
  ["protagonista", "Eu já sai da diretoria, bora brigar?", "x1"],
  { who: "jhowSimar", message: "Hm?", pose: "wakingUp" },
  ["jhowSimar", "Como que cê saiu?"],
  ["protagonista", "Eu usei a chave uaí", "talking"],
  ["jhowSimar", "Ah, eu esqueci de levar a chave comigo"],
  ["protagonista", "Relaxa, tem nada não", "good"],
  ["jhowSimar", "A gente não era para estar brigando?"],
  ["protagonista", "Eu não tenho inimigos", "good"],
  ["jhowSimar", "Mas eu tenho, vem cá vem"],
]);
