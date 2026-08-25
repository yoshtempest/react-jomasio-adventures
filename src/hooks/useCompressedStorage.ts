import { useState, useEffect } from "react";
import { saveCompressed, loadCompressed } from "@/services/save/storageService";
import { slotKey, type SlotScopedKey } from "@/services/save/slotManager";

export function useCompressedStorage<T>(
  key: SlotScopedKey,
  defaultValue: T,
  normalize?: (data: T) => T,
) {
  const [data, setData] = useState<T>(() => {
    const saved = loadCompressed<T>(slotKey(key));
    if (!saved) return defaultValue;
    try {
      return normalize ? normalize(saved) : saved;
    } catch {
      return defaultValue;
    }
  });

  useEffect(() => {
    saveCompressed(slotKey(key), data);
  }, [data, key]);

  return [data, setData] as const;
}
