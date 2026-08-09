import { npcPath } from "@/utils/paths";

export const pcsRoomDialogue = [
  {
    src: npcPath("/janderson/right.svg"),
    name: "Juan Derson",
    message: "Tipo assim... eu moro em canabruava",
  },
  {
    isPlayer: true,
    name: "Protagonista",
    message: "Achei que você morava em Nova York.",
  },
  {
    src: npcPath("/janderson/right.svg"),
    name: "Juan Derson",
    message: "Ééé... O Denis, ele... A Vandinha, ela...",
  },
  {
    isPlayer: true,
    name: "Protagonista",
    message: "Cala boca cara, eu não tô entendendo nada.",
  },
  {
    src: npcPath("/janderson/right.svg"),
    name: "Juan Derson",
    message: "Não, tipo assim, Você tem que escolher uma classe",
  },
];
