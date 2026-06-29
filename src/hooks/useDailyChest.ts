import { useState, useCallback, useEffect } from "react";
import { usePlayer } from "@/contexts/PlayerContext";
import { useCharacterProgress } from "@/contexts/CharacterProgressContext";
import { useEquipment } from "@/contexts/EquipmentContext";
import { useInventory } from "@/contexts/InventoryContext";
import { openChest, type ChestDropResult } from "@/data/items/chests";
import { DAILY_CHEST_KEY } from "@/data/storageKeys";
import { slotKey } from "@/utils/save/slotManager";

const COOLDOWN_MS = 6 * 60 * 60 * 1000;

const TIER_ORDER: NPCClass[] = ["common", "rare", "epic", "boss", "legendary"];

function pickTierForLevel(level: number): NPCClass {
  if (level <= 20) {
    const available = TIER_ORDER.slice(0, 2);
    return available[Math.floor(Math.random() * available.length)];
  }
  if (level <= 40) {
    const available = TIER_ORDER.slice(0, 4);
    return available[Math.floor(Math.random() * available.length)];
  }
  return TIER_ORDER[Math.floor(Math.random() * TIER_ORDER.length)];
}

export type DailyChestResult = ChestDropResult & {
  tier: NPCClass;
};

export function useDailyChest() {
  const { player } = usePlayer();
  const { progress } = useCharacterProgress();
  const { addDrop } = useEquipment();
  const { addItem } = useInventory();

  const level = progress[player.character]?.level ?? 1;

  const [lastOpen, setLastOpen] = useState(() => {
    try {
      const stored = localStorage.getItem(slotKey(DAILY_CHEST_KEY));
      return stored ? Number(stored) : 0;
    } catch {
      return 0;
    }
  });

  const [lastResult, setLastResult] = useState<DailyChestResult | null>(null);

  const calcTimeLeft = useCallback(
    () => COOLDOWN_MS - (Date.now() - lastOpen),
    [lastOpen],
  );

  const [timeLeft, setTimeLeft] = useState(calcTimeLeft);

  useEffect(() => {
    setTimeLeft(calcTimeLeft());
    const interval = setInterval(() => setTimeLeft(calcTimeLeft()), 1000);
    return () => clearInterval(interval);
  }, [calcTimeLeft]);

  const isReady = timeLeft <= 0;

  const open = useCallback(() => {
    if (!isReady) return null;

    const tier = pickTierForLevel(level);
    const result = openChest(tier);

    for (const mat of result.materials) {
      addItem({ id: mat.id as ItemId, qty: mat.qty });
    }
    for (const eq of result.equipment) {
      addDrop(player.character, eq.id as EquipmentId, eq.enhance);
    }

    const now = Date.now();
    try {
      localStorage.setItem(slotKey(DAILY_CHEST_KEY), String(now));
    } catch {}
    setLastOpen(now);
    const openResult: DailyChestResult = { ...result, tier };
    setLastResult(openResult);
    return openResult;
  }, [isReady, level, player.character, addItem, addDrop]);

  return {
    isReady,
    timeLeft: Math.max(0, timeLeft),
    lastResult,
    setLastResult,
    open,
    level,
  };
}
