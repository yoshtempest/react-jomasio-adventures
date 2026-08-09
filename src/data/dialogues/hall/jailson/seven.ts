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
  },
  {
    src: npcPath("/jailson/right.svg"),
    name: "Jailson",
    message:
      "Deve estar lá no lugar que você lutou com Vandinha e falou com o Juan Derson, sabe?",
  },
  {
    isPlayer: true,
    name: "Protagonista",
    message: "Como você sabe tanto sobre mim, caralho?",
  },
  {
    src: npcPath("/jailson/right.svg"),
    name: "Jailson",
    message: "Quem sabe, sabe, agora vai lá",
  },
];
