import { npcPath } from "@/utils/paths";

export const hallJailsonSevenDialogue = [
  {
    src: npcPath("/jailson/right.svg"),
    name: "Jailson",
    message: "Agora que eu tô relaxado, lembrei que preciso de...",
  },
  {
    isPlayer: true,
    name: "Protagonista",
    message: "E lá vamos nós de novo, o que você quer dessa vez?",
    expression: "crossArms"
  },
  {
    src: npcPath("/jailson/right.svg"),
    name: "Jailson",
    message:
      "Se você me trouxer a peça que eu quero, eu faço um mapa para você",
  },
  {
    isPlayer: true,
    name: "Protagonista",
    message: "E onde está essa tal peça?",
    expression: "crossArms"
  },
  {
    src: npcPath("/jailson/right.svg"),
    name: "Jailson",
    message:
      "Lá na sala dos pcs",
  },
  {
    isPlayer: true,
    name: "Protagonista",
    message: "Se você sabe de tudo, por que você mesmo não pega?",
    expression: "why"
  },
  {
    src: npcPath("/jailson/right.svg"),
    name: "Jailson",
    message: "Quem sabe, sabe, agora vai lá",
  },
] satisfies Dialogue[];
