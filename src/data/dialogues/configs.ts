import { defineDialogue } from "@/data/dialogues/defineDialogue";

/**
 * Abertura do tutorial de Config: Victor aparece deitado, teleporta para ficar
 * em pé e só então se apresenta. A pose `teleport` deixou de ser uma linha do
 * diálogo — ela virou efeito, disparado pelo `onConfirm` da linha "..." e
 * animado enquanto a fala seguinte está bloqueada. Por isso o diálogo é uma
 * factory: o retrato e o tempo da animação vivem no componente, não no dado.
 */
export const createConfigsDialogue = (onVictorTeleport: () => boolean | void) =>
  defineDialogue([
    {
      who: "victor",
      message: "...",
      pose: "lyingDown",
      onConfirm: onVictorTeleport,
    },
    {
      who: "victor",
      message:
        "Prazer, meu nome é Victor, eu sou um Novato nesse trampo de 'sistema' e estou aqui para lhe ensinar o básico",
      pose: "talking",
    },
    { who: "victor", message: "Bem, tipo assim, você-", pose: "pointing" },
    ["protagonista", "NUNCA MAIS FAÇA ISSO!", "angry"],
    [
      "victor",
      "Me perdoe... estou pegando esse péssimo hábito do Juan Derson.",
    ],
    [
      "victor",
      "Enfim, o Juan Derson deve ter lhe ensinado alguma coisa no ano passado, então, quero seminário para amanhã, boa sorte",
    ],
    [
      "victor",
      "Não se preocupe, que você vai sair daqui um Doutor! Vou ir ver My World, tchau.",
    ],
  ]);
