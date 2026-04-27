import { useQuests } from "@/contexts/QuestContext";

export function useQuestActions() {
  const { addQuest, updateProgress } = useQuests();

  return {
    giveQuest: addQuest,
    progressQuest: updateProgress
  };
}