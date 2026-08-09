import { npcPath } from "@/utils/paths";

export const jujuHouseDialogue = [
  {
    src: npcPath("/juju/right.svg"),
    name: "Juju",
    message:
      "Agora vai matar os mortos de fome por que eles ficam batendo palma a noite toda aqui",
  },
  {
    isPlayer: true,
    name: "Protagonista",
    message: "Matar os mortos?",
  },
  {
    src: npcPath("/juju/right.svg"),
    name: "Juju",
    message: "Você consegue, eu sei que você é o protagonista",
  },
  {
    isPlayer: true,
    name: "Protagonista",
    message: "Se você tá dizendo...",
  },
];
