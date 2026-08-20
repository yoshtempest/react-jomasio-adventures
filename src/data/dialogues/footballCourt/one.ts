import { npcPath, playerPath } from "@/utils/paths";

export const footballCourtDialogue = [
  {
    src: npcPath("/neimito/right.svg"),
    name: "Neimito",
    message: "Bom dia pessoal, vamo ver onde foi que paramos",
  },
  {
    src: npcPath("/neimito/right.svg"),
    name: "Neimito",
    message: "Ematron, observe o seguinte",
  },
  {
    src: npcPath("/neimito/right.svg"),
    name: "Neimito",
    message: "Certo, nada haver né? Certo?",
  },
  {
    src: playerPath("/emanuel/default.svg"),
    name: "Ematron",
    message: "Sim...",
  },
  {
    src: npcPath("/neimito/right.svg"),
    name: "Neimito",
    message: "O quê que motosserra tem haver com a aula?",
  },
  {
    src: npcPath("/neimito/right.svg"),
    name: "Neimito",
    message: "Certo Ematron, eu sou o menino Ney, certo?",
  },
  {
    src: playerPath("/emanuel/default.svg"),
    name: "Ematron",
    message: "Certo...",
  },
  {
    src: npcPath("/neimito/right.svg"),
    name: "Neimito",
    message: "Que sono é esse? Você nem trabalha.",
  },
  {
    src: npcPath("/neimito/right.svg"),
    name: "Neimito",
    message:
      "Certo, iremos estudar termometria, e para isso precisamos do calor entre os corpos, certo?",
  },
  {
    src: npcPath("/neimito/right.svg"),
    name: "Neimito",
    message:
      "Certo, já que o Denis não está aqui, você irá me ajudar a gerar um calor.",
  },
  {
    src: playerPath("/emanuel/default.svg"),
    name: "Ematron",
    message: "Mas você vai me soltar né Ney?",
  },
  {
    src: npcPath("/neimito/right.svg"),
    name: "Neimito",
    message: "Chupa",
  },
  {
    isPlayer: true,
    name: "Protagonista",
    message: "Eu já sei de tudo Neimito, você não é o verdadeiro Ney",
    expression: "angry",
  },
  {
    src: npcPath("/neimito/right.svg"),
    name: "Neimito",
    message: "Droga, justo na melhor parte!",
  },
  {
    src: npcPath("/neimito/right.svg"),
    name: "Neimito",
    message: "Vamos aquecer o clima então!",
  },
];
