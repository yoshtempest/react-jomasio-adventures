import { useState, useCallback } from "react";
import { REWARDS, isCharRewardId } from "@/data/rewards";
import { usePlayer } from "@/contexts/PlayerContext";
import { useCharacterProgress } from "@/contexts/CharacterProgressContext";
import { useTitles } from "@/contexts/TitleContext";
import { usePlayTime } from "@/contexts/PlayTimeContext";
import { useFlags } from "@/contexts/FlagContext";
import { useBestiary } from "@/contexts/BestiaryContext";
import { getClassKills } from "@/utils/rewards/classKills";
import type { Character } from "@/utils/types/player/player";
import {
  getProgress,
  getUnlockedCount,
  getMaxNpcKills,
  loadProgress,
  saveProgress,
  type RewardsProgress,
} from "@/gameRules/rewards/progress";

export function useRewards() {
  const { player } = usePlayer();
  const { progress: charsProgress, addHyperCoins } = useCharacterProgress();
  const { titlesData } = useTitles();
  const { getTotalPlayTime } = usePlayTime();
  const { flags } = useFlags();
  const { bestiary } = useBestiary();

  const [progress, setProgress] = useState<RewardsProgress>(loadProgress);

  const totalKills = titlesData.totalKills;
  const totalPlayTime = getTotalPlayTime();
  const unlockedCount = getUnlockedCount(flags);
  const maxNpcKills = getMaxNpcKills(
    bestiary as unknown as Record<string, { kills: number }>,
  );
  const classKills = getClassKills();

  const claim = useCallback(
    (rewardId: string) => {
      const def = REWARDS.find((r) => r.id === rewardId);
      if (!def) return;

      const stage = progress[rewardId] ?? 0;
      const { current, requirement } = getProgress(
        def,
        stage,
        totalKills,
        totalPlayTime,
        unlockedCount,
        maxNpcKills,
        classKills,
        charsProgress,
      );

      if (current < requirement) return;

      const reward = def.getReward(stage);
      const parsed = isCharRewardId(rewardId);
      const recipient = parsed
        ? (parsed.charId as Character)
        : player.character;
      addHyperCoins(recipient, reward);

      setProgress((prev) => {
        const next = { ...prev, [rewardId]: stage + 1 };
        saveProgress(next);
        return next;
      });
    },
    [
      progress,
      totalKills,
      totalPlayTime,
      unlockedCount,
      maxNpcKills,
      classKills,
      charsProgress,
      player.character,
      addHyperCoins,
    ],
  );

  const rewards = REWARDS.map((def) => {
    const stage = progress[def.id] ?? 0;
    const { current, requirement } = getProgress(
      def,
      stage,
      totalKills,
      totalPlayTime,
      unlockedCount,
      maxNpcKills,
      classKills,
      charsProgress,
    );
    const reward = def.getReward(stage);
    const canClaim = current >= requirement;
    const parsed = isCharRewardId(def.id);

    return {
      id: def.id,
      label: def.label.replace("{req}", String(requirement)),
      current,
      requirement,
      reward,
      canClaim,
      charId: parsed?.charId,
    };
  });

  return { rewards, claim };
}
