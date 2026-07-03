import type { QuestMap, QuestTab } from "@/utils/types/player/quest";

function partitionQuests(allQuests: Quest[]): QuestMap {
  const isStandard = (q: Quest) =>
    q.frequency !== "daily" && q.frequency !== "weekly";

  return {
    active: allQuests.filter(
      (q) => isStandard(q) && (!q.completed || !q.claimed),
    ),
    completed: allQuests.filter(
      (q) => isStandard(q) && q.completed && q.claimed,
    ),
    daily: allQuests.filter((q) => q.frequency === "daily" && !q.claimed),
    weekly: allQuests.filter((q) => q.frequency === "weekly" && !q.claimed),
  };
}

export function useQuestItems(allQuests: Quest[], activeTab: QuestTab) {
  const tabMap = partitionQuests(allQuests);
  const visibleQuests = tabMap[activeTab];

  return {
    activeQuests: tabMap.active,
    completedQuests: tabMap.completed,
    dailyQuests: tabMap.daily,
    weeklyQuests: tabMap.weekly,
    visibleQuests,
    tabMap,
  };
}
