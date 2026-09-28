import { soundEffectPath } from "@/utils/paths";

import { defineDialogue } from "@/data/dialogues/defineDialogue";

export const cantinaDialogue = defineDialogue([
  ["jhowSimar", "Tu... tu tá com um objeto amaldiçoado!"],
  ["protagonista", "Como assim? O que vo-", "ops"],
  {
    who: "jhowSimar",
    message: "Pega a lapada pega",
    soundSrc: soundEffectPath("npc/jhowsimar/getTheLapada.mp3"),
    autoAdvanceOnSound: true,
  },
]);
