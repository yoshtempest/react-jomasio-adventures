import { defineDialogue } from "@/data/dialogues/defineDialogue";

export const cafeteriaFiveDialogue = defineDialogue([
  { who: "denis", message: "Pronto, obrigado", pose: "tranks" },
  ["protagonista", "Posso ir embora agora?", "crossArms"],
  { who: "denis", message: "Faz o que quiser, a porta nem tava trancada", pose: "tranks" },
  ["protagonista", "AAAA MALDITO!", "desperate"],
  { who: "denis", message: "Tchau", pose: "tranks" },
]);
