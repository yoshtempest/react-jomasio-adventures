import { npcPath } from "@/utils/paths";

export const hallJailsonEightDialogue = [
  {
    src: npcPath("/jailson/right.svg"),
    name: "Jailson",
    message: "Isso! Era essa a peça que eu queria!",
  },
  {
    isPlayer: true,
    name: "Protagonista",
    message: "E ai? Você vai me dar o mapa agora?",
    expression: "crossArms"
  },
  {
    src: npcPath("/jailson/right.svg"),
    name: "Jailson",
    message: "Chato, né? Mas tudo bem, aqui está o mapa",
  },
] satisfies Dialogue[];
