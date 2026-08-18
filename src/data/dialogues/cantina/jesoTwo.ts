import { npcPath } from "@/utils/paths";

export const cantinaJesoTwoDialogue = [
  {
    src: npcPath("/jeso/default.svg"),
    name: "Jeso",
    message: "Não aguento esse rojão, não",
  },
  {
    isPlayer: true,
    name: "Protagonista",
    message: "Como assim?",
    expression: "why"
  },
  {
    src: npcPath("/jeso/default.svg"),
    name: "Jeso",
    message:
      "Só te dou uma comida a cada 10 minutos, dá uma relaxada ai enquanto isso.",
  },
];
