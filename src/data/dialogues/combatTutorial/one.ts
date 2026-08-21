import { npcPath } from "@/utils/paths";

export const combatTutorialDialogue = [
  {
    src: npcPath("/surica/default.svg"),
    name: "Surica",
    message:
      "Olá jogador, meu nome é Surica e sou apenas um cara qualquer que notou sua presença nessa linha temporal.",
  },
  {
    isPlayer: true,
    name: "Protagonista",
    message: "Linha temporal?",
    expression: "crossArms"
  },
  {
    src: npcPath("/surica/default.svg"),
    name: "Surica",
    message: "Uh, nas redondezas, foi isso que eu quis dizer.",
  },
  {
    isPlayer: true,
    name: "Protagonista",
    message: "Eu tava no tutorial ou algo assim agora pouco, não foi?",
    expression: "why"
  },
  {
    src: npcPath("/surica/default.svg"),
    name: "Surica",
    message:
      "O pessoal desse universo não é muito de ajudar os outros então eu acabei decidindo ser seu guia no tutorial de combate-",
  },
  {
    src: npcPath("/surica/default.svg"),
    name: "Surica",
    message: "Afinal, você precisa saber lutar para sobreviver na Terra nº 11.",
  },
  {
    isPlayer: true,
    name: "Protagonista",
    message: "Bem, o que eu devo fazer?",
    expression: "crossArms"
  },
  {
    src: npcPath("/surica/default.svg"),
    name: "Surica",
    message: "Faça o que eu falo mas não faça o que eu faço.",
  },
] satisfies Dialogue[];
