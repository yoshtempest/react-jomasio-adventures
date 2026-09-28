import { soundEffectPath } from "@/utils/paths";

import { defineDialogue } from "@/data/dialogues/defineDialogue";

export const hallHellOneDialogue = defineDialogue([
  {
    who: "blackao",
    message: "Vá pro inferno!",
    soundSrc: soundEffectPath("npc/goToHell.mp3"),
  },
]);
