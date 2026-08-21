import { npcPath } from "@/utils/paths";

export const HellRoomThreeDialogue = [
  {
    src: npcPath("/maugrelo/right.svg"),
    name: "Maugrelo",
    message: "Largue o meu peru!!!",
  },
  {
    isPlayer: true,
    name: "Protagonista",
    message: "hm? cadê aquele homem?",
    expression: "crossArms",
  },
  {
    src: npcPath("/maugrelo/right.svg"),
    name: "Maugrelo",
    message: "Eu vou pegar meu Peru de volta!",
  },
] satisfies Dialogue[];
