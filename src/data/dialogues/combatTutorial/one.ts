import { defineDialogue } from "@/data/dialogues/defineDialogue";

export const combatTutorialDialogue = defineDialogue([
  ["surica", "Olá jogador, meu nome é Surica e sou apenas um cara qualquer que notou sua presença nessa linha temporal."],
  ["protagonista", "Linha temporal?", "crossArms"],
  ["surica", "Uh, nas redondezas, foi isso que eu quis dizer."],
  ["protagonista", "Eu tava no tutorial ou algo assim agora pouco, não foi?", "why"],
  ["surica", "O pessoal desse universo não é muito de ajudar os outros então eu acabei decidindo ser seu guia no tutorial de combate-"],
  ["surica", "Afinal, você precisa saber lutar para sobreviver na Terra nº 11."],
  ["protagonista", "Bem, o que eu devo fazer?", "crossArms"],
  ["surica", "Faça o que eu falo mas não faça o que eu faço."],
]);
