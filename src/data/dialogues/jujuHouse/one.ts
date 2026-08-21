import { npcPath } from "@/utils/paths";

export const jujuHouseDialogue = [
  {
    src: npcPath("/juju/right.svg"),
    name: "Juju",
    message: "Fala pros meninos pararem com essas brincadeiras gostosas",
  },
  {
    src: npcPath("/juju/right.svg"),
    name: "Juju",
    message: "Eles passam a noite toda batendo palma na frente daqui de casa",
  },
  {
    isPlayer: true,
    name: "Protagonista",
    message: "Vish...",
  },
  {
    src: npcPath("/juju/right.svg"),
    name: "Juju",
    message: "Preciso de um leite de boi para o bolo de hoje",
  },
  {
    isPlayer: true,
    name: "Protagonista",
    message: "Vish...",
  },
  {
    src: npcPath("/juju/right.svg"),
    name: "Juju",
    message:
      "Vai lá no açougue de Tim que ele conhece um tal de Zé do Milk e pede um leite de boi que dá certo",
  },
  {
    src: npcPath("/juju/right.svg"),
    name: "Juju",
    message: "Primeiro fala com Zé do Milk que dá tudo certo",
  },
  {
    isPlayer: true,
    name: "Protagonista",
    message: "Tá",
  },
] satisfies Dialogue[];
