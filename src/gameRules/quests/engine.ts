import { historyQuests } from "@/gameRules/quests/history";
import { useQuestActions } from "@/hooks/useQuestActions";
import { useCharacterProgress } from "@/contexts/CharacterProgressContext";
import { usePlayer } from "@/contexts/PlayerContext";

export function useQuestEngine() {
  const { giveQuest } = useQuestActions();
  const { addXP } = useCharacterProgress();
  const { player } = usePlayer();

  function completeQuest(questId: string) {
    const quest = historyQuests[questId];
    if (!quest) return;

    // 🎁 XP
    addXP(player.character, quest.rewardXP);

    // 🔗 próxima missão
    if (quest.nextQuestId) {
      const nextQuest = historyQuests[quest.nextQuestId];
      if (nextQuest) {
        giveQuest(nextQuest);
      }
    }
  }

  return {
    completeQuest
  };
}