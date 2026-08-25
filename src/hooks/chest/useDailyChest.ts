import { useState, useCallback } from "react";
import { usePlayer } from "@/contexts/PlayerContext";
import { useCharacterProgress } from "@/contexts/CharacterProgressContext";
import { useEquipment } from "@/contexts/EquipmentContext";
import { useInventory } from "@/contexts/InventoryContext";
import { useQuests } from "@/contexts/QuestContext";
import { useSoundEffects } from "@/contexts/SoundEffectsContext";
import { openChest, type ChestDropResult } from "@/data/items/chests";
import { DAILY_CHEST_KEY } from "@/data/storageKeys";
import { slotKey } from "@/services/save/slotManager";
import { DAILY_CHEST_COOLDOWN_MS } from "@/data/cooldowns";
import { useCountdown } from "@/hooks/useCountdown";

const TIER_ORDER: NPCClass[] = ["common", "rare", "epic", "boss", "legendary"];

function pickTierForLevel(level: number): NPCClass {
  if (level <= 20) {
    const available = TIER_ORDER.slice(0, 2);
    return available[Math.floor(Math.random() * available.length)]!;
  }
  if (level <= 40) {
    const available = TIER_ORDER.slice(0, 4);
    return available[Math.floor(Math.random() * available.length)]!;
  }
  return TIER_ORDER[Math.floor(Math.random() * TIER_ORDER.length)]!;
}

export type DailyChestResult = ChestDropResult & {
  tier: NPCClass;
};

/**
 * Desfecho de uma tentativa de abrir o baú diário.
 *
 * `inventoryFull` bloqueia a abertura antes de gravar o cooldown: sem
 * isso o jogador queimaria o baú do dia e perderia os materiais que não
 * couberam na mochila.
 */
export type DailyChestOutcome =
  | { status: "opened"; result: DailyChestResult }
  | { status: "notReady" }
  | { status: "inventoryFull" };

export function useDailyChest() {
  const { player } = usePlayer();
  const { progress } = useCharacterProgress();
  const { addDrop } = useEquipment();
  const { addItem, hasSpaceFor } = useInventory();
  const { progressDailyWeekly } = useQuests();
  const { playSound } = useSoundEffects();

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

  const timeLeft = useCountdown(DAILY_CHEST_COOLDOWN_MS, lastOpen);

  const isReady = timeLeft <= 0;

  const open = useCallback((): DailyChestOutcome => {
    if (!isReady) return { status: "notReady" };

    const tier = pickTierForLevel(level);
    const result = openChest(tier, 0.05);

    const materials = result.materials.map((mat) => ({
      id: mat.id as ItemId,
      qty: mat.qty,
    }));

    if (!hasSpaceFor(materials)) return { status: "inventoryFull" };

    for (const mat of result.materials) {
      addItem({ id: mat.id as ItemId, qty: mat.qty });
      progressDailyWeekly("collect_material", mat.qty);
      if (mat.id === "hungry_essence")
        progressDailyWeekly("collect_hungry_essence", mat.qty);
      else if (mat.id === "goat_horn")
        progressDailyWeekly("collect_goat_horn", mat.qty);
    }
    for (const eq of result.equipment) {
      addDrop(player.character, eq.id, eq.enhance);
    }
    for (const pet of result.pets) {
      addDrop(player.character, pet.id, pet.enhance);
    }

    const now = Date.now();
    try {
      localStorage.setItem(slotKey(DAILY_CHEST_KEY), String(now));
    } catch {}
    setLastOpen(now);
    playSound("chestOpening");
    const openResult: DailyChestResult = { ...result, tier };
    setLastResult(openResult);
    return { status: "opened", result: openResult };
  }, [
    isReady,
    level,
    hasSpaceFor,
    player.character,
    addItem,
    addDrop,
    playSound,
    progressDailyWeekly,
  ]);

  return {
    isReady,
    timeLeft,
    lastResult,
    setLastResult,
    open,
    level,
  };
}
