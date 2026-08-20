import { npcPath } from "@/utils/paths";

export const hallJailsonNineDialogue = [
  {
    src: npcPath("/jailson/right.svg"),
    name: "Jailson",
    message: "Agora que você tem o mapa, some daqui.",
  },
  {
    isPlayer: true,
    name: "Protagonista",
    message: "Tá",
    expression: "crossArms"
  },
];
