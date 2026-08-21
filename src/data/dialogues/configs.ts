import { defineDialogue } from "@/data/dialogues/defineDialogue";

export const configsDialogue = defineDialogue([
  { who: "victor", message: "...", pose: "lyingDown" },
  { who: "victor", message: "...", pose: "teleport" },
  {
    who: "victor",
    message:
      "Prazer, meu nome é Victor, eu sou um Novato nesse trampo de 'sistema' e estou aqui para lhe ensinar o básico",
    pose: "talking",
  },
  { who: "victor", message: "Bem, tipo assim, você-", pose: "pointing" },
  ["protagonista", "NUNCA MAIS FAÇA ISSO!", "angry"],
  ["victor", "Me perdoe... estou pegando esse péssimo hábito do Juan Derson."],
  [
    "victor",
    "Enfim, o Juan Derson deve ter lhe ensinado alguma coisa no ano passado, então, quero seminário para amanhã, boa sorte",
  ],
  [
    "victor",
    "Não se preocupe, que você vai sair daqui um Doutor! Vou ir ver My World, tchau.",
  ],
]);
