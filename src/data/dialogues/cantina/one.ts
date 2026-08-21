import { npcPath } from "@/utils/paths";

export const cantinaDialogue = [
  {
    src: npcPath("/jhowsimar/right.svg"),
    name: "Jhow Simar",
    message: "Tu... tu tá com um objeto amaldiçoado!",
  },
  {
    isPlayer: true,
    name: "Protagonista",
    message: "Como assim? O que vo-",
    expression: "ops"
  },
  {
    src: npcPath("/jhowsimar/right.svg"),
    name: "Jhow Simar",
    message: "Pega a lapada pega",
    soundSrc: "/assets/songs/soundEffects/npc/jhowsimar/getTheLapada.mp3",
    autoAdvanceOnSound: true,
  },
] satisfies Dialogue[];
