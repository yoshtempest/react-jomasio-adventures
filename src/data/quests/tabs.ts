import type { QuestTab } from "@/utils/types/player/quest";

export const TAB_LABELS: Record<QuestTab, string> = {
  active: "Em andamento",
  completed: "Concluídas",
  daily: "Diárias",
  weekly: "Semanais",
};

export const TAB_KEYS: QuestTab[] = ["active", "completed", "daily", "weekly"];

export function getEmptyMessage(tab: QuestTab): string {
  switch (tab) {
    case "active":
      return "Nenhuma missão em andamento.";
    case "completed":
      return "Nenhuma missão concluída.";
    case "daily":
      return "Nenhuma missão diária disponível.";
    case "weekly":
      return "Nenhuma missão semanal disponível.";
  }
}

export const QUEST_TABS: QuestTab[] = [
  "active",
  "completed",
  "daily",
  "weekly",
];

export const TAB_COUNT = QUEST_TABS.length;
