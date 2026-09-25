import { useState, useCallback, useRef, useEffect } from "react";
import type {
  LootBagContents,
  LootNotification,
} from "@/utils/types/battle/loot";
import { contentsToEntries } from "./contentsToEntries";


const NOTIFICATION_DURATION_MS = 2000;

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
