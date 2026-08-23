import { useState, useCallback } from "react";
import {
  MONTHLY_MISSIONS,
  type MonthlyMissionDef,
} from "@/data/rewards/monthlyPass";
import { MONTHLY_PASS_KEY } from "@/data/storageKeys";
import { usePlayer } from "@/contexts/PlayerContext";
import { useCharacterProgress } from "@/contexts/CharacterProgressContext";
import { useTitles } from "@/contexts/TitleContext";
import { usePlayTime } from "@/contexts/PlayTimeContext";
import { slotKey } from "@/services/save/slotManager";
import { getClassKills } from "@/utils/rewards/classKills";
import { getBlockCount } from "@/utils/rewards/blockCounter";
import { getDamageDealtStats } from "@/utils/rewards/battleStats";

function getCurrentMonth(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

type StoredPass = {
  month: string;
  claimed: string[];
};

function loadPass(): StoredPass {
  try {
    const raw = localStorage.getItem(slotKey(MONTHLY_PASS_KEY));
    if (!raw) return { month: getCurrentMonth(), claimed: [] };
    const parsed = JSON.parse(raw) as StoredPass;
    if (parsed.month !== getCurrentMonth()) {
      return { month: getCurrentMonth(), claimed: [] };
    }
    return parsed;
  } catch {
    return { month: getCurrentMonth(), claimed: [] };
  }
}

function savePass(data: StoredPass): void {
  try {
    localStorage.setItem(slotKey(MONTHLY_PASS_KEY), JSON.stringify(data));
  } catch {}
}

function getMissionProgress(
  def: MonthlyMissionDef,
  totalKills: number,
  totalPlayTime: number,
  loginDays: number,
  classKills: Record<string, number>,
): number {
  switch (def.id) {
    case "kill_enemies":
      return totalKills;
    case "play_time":
      return Math.floor(totalPlayTime / 3600);
    case "kill_boss":
      return classKills.boss ?? 0;
    case "kill_legendary":
      return classKills.legendary ?? 0;
    case "damage_dealt":
      return getDamageDealtStats().total;
    case "blocks":
      return getBlockCount().total;
    case "login_days":
      return loginDays;
    default:
      return 0;
  }
}

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
