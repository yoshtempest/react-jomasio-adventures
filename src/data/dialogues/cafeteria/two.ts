import { npcPath } from "@/utils/paths";

export const cafeteriaTwoDialogue = [
  {
    src: npcPath("/deise/right.svg"),
    name: "Deise",
    message:
      "Oxe, tu venceu? Tinha que ser o protanista né, tem tentativa infinita",
  },
  {
    isPlayer: true,
    name: "Protagonista",
    message: "Quem pode, pode",
    expression: "special",
  },
  {
    src: npcPath("/deise/right.svg"),
    name: "Deise",
    message:
      "Eu voltarei mais forte lá no End-Game viu, nunca vá ao tanque dos crávos...",
  },
  {
    src: npcPath("/deise/right.svg"),
    name: "Deise",
    message: "Oxe!? Senhor Denis, tá fazendo o que aqui?",
  },
] satisfies Dialogue[];
