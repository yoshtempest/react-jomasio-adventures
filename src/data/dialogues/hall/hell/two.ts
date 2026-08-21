import { defineDialogue } from "@/data/dialogues/defineDialogue";

export const hallHellTwoDialogue = defineDialogue([
  { who: "blackao", message: "Vá pro inferno!", soundSrc: "/assets/songs/soundEffects/npc/goToHell.mp3" },
  ["protagonista", "Eu num vou não", "crossArms"],
  { who: "blackao", message: "Vá pro inferno!", soundSrc: "/assets/songs/soundEffects/npc/goToHell.mp3" },
  ["protagonista", "Quer brigar?", "x1"],
  { who: "blackao", message: "Vá pro inferno!", soundSrc: "/assets/songs/soundEffects/npc/goToHell.mp3" },
  ["protagonista", "Então vem pro fight vem", "x1"],
  ["blackao", "Eu mesmo vou te levar então!"],
]);
