import { defineDialogue } from "@/data/dialogues/defineDialogue";

export const cantinaJesoDialogue = defineDialogue([
  ["jeso", "Eae, quer uma comida?"],
  { who: "protagonista", message: "Tô cagado de fome", expression: "hungry", soundSrc: "/assets/songs/soundEffects/player/imFuckingStarving.mp3" },
  ["jeso", "Não era nesse sentido que eu tava falando, mas beleza, eu posso te dar uma comida."],
]);
