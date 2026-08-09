import { npcPath } from "@/utils/paths";

export const configsDialogue = [
  {
    src: npcPath("/victor/lyingDown.svg"),
    name: "Victor",
    message: "...",
  },
  {
    src: npcPath("/victor/teleport.svg"),
    name: "Victor",
    message: "...",
  },
  {
    src: npcPath("/victor/talking.svg"),
    name: "Victor",
    message:
      "Prazer, meu nome é Victor, eu sou um Novato nesse trampo de 'sistema' e estou aqui para lhe ensinar o básico",
  },
  {
    src: npcPath("/victor/pointing.svg"),
    name: "Victor",
    message: "Bem, tipo assim, você-",
  },
  {
    isPlayer: true,
    name: "Protagonista",
    message: "NUNCA MAIS FAÇA ISSO!",
  },
  {
    src: npcPath("/victor/sitting.svg"),
    name: "Victor",
    message: "Me perdoe... estou pegando esse péssimo hábito do Juan Derson.",
  },
  {
    src: npcPath("/victor/sitting.svg"),
    name: "Victor",
    message:
      "Enfim, o Juan Derson deve ter lhe ensinado alguma coisa no ano passado, então, quero seminário para amanhã, boa sorte",
  },
  {
    src: npcPath("/victor/sitting.svg"),
    name: "Victor",
    message:
      "Não se preocupe, que você vai sair daqui um Doutor! Vou ir ver My World, tchau.",
  },
];
