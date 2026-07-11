import type { QuestTab } from "@/utils/types/player/quest";

export const TAB_ICONS: Record<QuestTab, string> = {
  active: "/assets/quests/inProgress.svg",
  completed: "/assets/quests/conclued.svg",
  daily: "/assets/quests/daily.svg",
  weekly: "/assets/quests/weekly.svg",
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
