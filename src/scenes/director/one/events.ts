import { DIRECTOR_ROUTES } from "@/scenes/shared/routes";

export const directorEvents: SceneEvent[] = [
  {
    type: "conditional",
    condition: { notHasQuest: "director_escape" },
    then: [{ type: "giveQuest", questId: "director_escape" }],
  },
  // O atraso dá tempo do Sistema terminar de piscar fora antes da troca de sala:
  // 240ms dissolvendo + 420ms de feixe, mais uma batida de respiro.
  { type: "navigate", to: DIRECTOR_ROUTES.TWO, delay: 900 },
];
