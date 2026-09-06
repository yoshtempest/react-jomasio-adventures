import { useState, useCallback, useRef, useEffect } from "react";
import { ITEMS } from "@/data/items";
import type {
  LootBagContents,
  LootNotification,
  LootNotifyEntry,
} from "@/utils/types/battle/loot";

const NOTIFICATION_DURATION_MS = 2000;

function contentsToEntries(contents: LootBagContents): LootNotifyEntry[] {
  const entries: LootNotifyEntry[] = [];

  if (contents.coins > 0) {
    entries.push({
      icon: ITEMS.kwanzas.image,
      qty: contents.coins,
      name: "kwanzas",
    });
  }

  if (contents.hyperCoins > 0) {
    entries.push({
      icon: ITEMS.hypercoin.image,
      qty: contents.hyperCoins,
      name: "hypercoins",
    });
  }

  for (const drop of contents.itemDrops) {
    const itemData = ITEMS[drop.id];
    entries.push({
      icon: drop.image ?? itemData?.image ?? `/assets/items/${drop.id}.svg`,
      qty: drop.qty,
      name: drop.name,
    });
  }

  for (const drop of contents.equipmentDrops) {
    const equipData = ITEMS[drop.id as keyof typeof ITEMS];
    entries.push({
      icon: equipData?.image ?? `/assets/items/${drop.id}.svg`,
      qty: 1,
      name: `${drop.name} +${drop.enhance}`,
    });
  }

  if (contents.chestDrop) {
    const chestData = ITEMS[contents.chestDrop.id];
    entries.push({
      icon: chestData?.image ?? `/assets/items/${contents.chestDrop.id}.svg`,
      qty: 1,
      name: contents.chestDrop.name,
    });
  }

  if (contents.keyDrop) {
    const keyData = ITEMS[contents.keyDrop.id];
    entries.push({
      icon: keyData?.image ?? `/assets/items/${contents.keyDrop.id}.svg`,
      qty: 1,
      name: contents.keyDrop.name,
    });
  }

  return entries;
}

export function useLootNotifications() {
  const [notifications, setNotifications] = useState<LootNotification[]>([]);
  const idRef = useRef(0);
  const timersRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(
    new Map(),
  );

  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      timers.forEach((t) => clearTimeout(t));
      timers.clear();
    };
  }, []);

  const spawnLootNotification = useCallback(
    (contents: LootBagContents, x: number, y: number) => {
      const entries = contentsToEntries(contents);
      if (entries.length === 0) return;

      const id = idRef.current++;
      const notification: LootNotification = { id, x, y, entries };
      setNotifications((prev) => [...prev, notification]);

      const timer = setTimeout(() => {
        timersRef.current.delete(id);
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, NOTIFICATION_DURATION_MS);

      timersRef.current.set(id, timer);
    },
    [],
  );

  const clearNotifications = useCallback(() => {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current.clear();
    setNotifications([]);
  }, []);

  return { notifications, spawnLootNotification, clearNotifications };
}
