import { useState, useCallback } from "react";
import { JESO_FOOD_KEY } from "@/data/storageKeys";
import { slotKey } from "@/utils/save/slotManager";
import { FOODS } from "@/data/items/food";
import { JESO_FOOD_COOLDOWN_MS } from "@/data/cooldowns";
import { useCountdown } from "@/hooks/useCountdown";

function getRandomFoodIds(count: number): string[] {
  const foodIds = Object.keys(FOODS);
  const result: string[] = [];
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * foodIds.length);
    result.push(foodIds[randomIndex]!);
  }
  return result;
}

export function useJesoFoodCooldown() {
  const [lastDelivery, setLastDelivery] = useState(() => {
    try {
      const stored = localStorage.getItem(slotKey(JESO_FOOD_KEY));
      return stored ? Number(stored) : 0;
    } catch {
      return 0;
    }
  });

  const timeLeft = useCountdown(JESO_FOOD_COOLDOWN_MS, lastDelivery);

  const isReady = timeLeft <= 0;

  const giveFood = useCallback(() => {
    if (!isReady) return [];

    const foodIds = getRandomFoodIds(3);

    const now = Date.now();
    try {
      localStorage.setItem(slotKey(JESO_FOOD_KEY), String(now));
    } catch {}

    setLastDelivery(now);
    return foodIds;
  }, [isReady]);

  return {
    isReady,
    timeLeft,
    giveFood,
  };
}
