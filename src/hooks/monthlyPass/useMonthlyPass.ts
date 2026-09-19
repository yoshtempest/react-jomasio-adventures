import { useState, useCallback } from "react";
import { MONTHLY_MISSIONS } from "@/data/rewards/monthlyPass";
import { usePlayer } from "@/contexts/PlayerContext";
import { useCharacterProgress } from "@/contexts/CharacterProgressContext";
import { useTitles } from "@/contexts/TitleContext";
import { usePlayTime } from "@/contexts/PlayTimeContext";
import { getClassKills } from "@/utils/rewards";
import type { StoredPass } from "./types";
import { getCurrentMonth } from "./getCurrentMonth";
import { loadPass } from "./loadPass";
import { getMissionProgress } from "./getMissionProgress";
import { savePass } from "./savePass";

export function useMonthlyPass() {
  const { player } = usePlayer();
  const { addHyperCoins } = useCharacterProgress();
  const { titlesData } = useTitles();
  const { getTotalPlayTime, loginDays } = usePlayTime();

  const [stored, setStored] = useState<StoredPass>(loadPass);

  const currentMonth = getCurrentMonth();
  const totalKills = titlesData.totalKills;
  const totalPlayTime = getTotalPlayTime();
  const classKills = getClassKills();

  const missions = MONTHLY_MISSIONS.map((def) => {
    const progress = getMissionProgress(
      def,
      totalKills,
      totalPlayTime,
      loginDays,
      classKills,
    );
    const completed = progress >= def.requirement;
    const claimed = stored.claimed.includes(def.id);

    return {
      id: def.id,
      label: def.label.replace("{req}", String(def.requirement)),
      progress,
      requirement: def.requirement,
      reward: def.reward,
      completed,
      claimed,
      canClaim: completed && !claimed,
    };
  });

  const completedCount = missions.filter((m) => m.claimed).length;
  const totalCount = missions.length;
  const pct =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const claim = useCallback(
    (missionId: string) => {
      const def = MONTHLY_MISSIONS.find((m) => m.id === missionId);
      if (!def) return;

      const progress = getMissionProgress(
        def,
        totalKills,
        totalPlayTime,
        loginDays,
        classKills,
      );
      if (progress < def.requirement) return;
      if (stored.claimed.includes(def.id)) return;

      addHyperCoins(player.character, def.reward);

      setStored((prev) => {
        const updated = {
          month: prev.month,
          claimed: [...prev.claimed, def.id],
        };
        savePass(updated);
        return updated;
      });
    },
    [
      stored,
      totalKills,
      totalPlayTime,
      loginDays,
      classKills,
      player.character,
      addHyperCoins,
    ],
  );

  return {
    missions,
    currentMonth,
    completedCount,
    totalCount,
    pct,
    claim,
  };
}
