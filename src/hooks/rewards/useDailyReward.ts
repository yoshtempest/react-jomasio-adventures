import { useState, useCallback, useEffect } from "react";
import { DAILY_REWARD } from "@/data/rewards/dailyReward";
import { DAILY_REWARD_KEY } from "@/data/storageKeys";
import { usePlayer } from "@/contexts/PlayerContext";
import { useCharacterProgress } from "@/contexts/CharacterProgressContext";
import { slotKey } from "@/services/save/slotManager";
import { getTimeUntilMidnight } from "@/utils/quest/questTimer";

function getTodayDate(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function loadLastClaim(): string {
  try {
    return localStorage.getItem(slotKey(DAILY_REWARD_KEY)) ?? "";
  } catch {
    return "";
  }
}

function saveLastClaim(date: string): void {
  try {
    localStorage.setItem(slotKey(DAILY_REWARD_KEY), date);
  } catch {}
}

export function useDailyReward() {
  const { player } = usePlayer();
  const { addCoins, addHyperCoins } = useCharacterProgress();
  const [lastClaimDate, setLastClaimDate] = useState(loadLastClaim);
  const [timer, setTimer] = useState(getTimeUntilMidnight);

  const today = getTodayDate();
  const canClaim = lastClaimDate !== today;

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(getTimeUntilMidnight());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const claim = useCallback(() => {
    if (!canClaim) return;
    const coinsAmount =
      DAILY_REWARD.coinsMin +
      Math.floor(
        Math.random() * (DAILY_REWARD.coinsMax - DAILY_REWARD.coinsMin + 1),
      );
    addHyperCoins(player.character, DAILY_REWARD.hyperCoins);
    addCoins(player.character, coinsAmount);
    saveLastClaim(today);
    setLastClaimDate(today);
  }, [canClaim, today, player.character, addHyperCoins, addCoins]);

  return {
    canClaim,
    timer,
    claim,
    hyperCoins: DAILY_REWARD.hyperCoins,
    coinsMin: DAILY_REWARD.coinsMin,
    coinsMax: DAILY_REWARD.coinsMax,
  };
}
