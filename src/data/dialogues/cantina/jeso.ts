import { npcPath } from "@/utils/paths";

export const cantinaJesoDialogue = [
  {
    src: npcPath("/jeso/default.svg"),
    name: "Jeso",
    message: "Eae, quer uma comida?",
  },
  {
    isPlayer: true,
    name: "Protagonista",
    message: "Tô cagado de fome",
    soundSrc: "/assets/songs/soundEffects/player/imFuckingStarving.mp3",
    expression: "hungry"
  },
  {
    src: npcPath("/jeso/default.svg"),
    name: "Jeso",
    message:
      "Não era nesse sentido que eu tava falando, mas beleza, eu posso te dar uma comida.",
  },
] satisfies Dialogue[];
