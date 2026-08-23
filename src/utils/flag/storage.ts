import { FLAGS_KEY } from "@/data/storageKeys";
import { saveCompressed, loadCompressed } from "@/services/save/storageService";
import { slotKey } from "@/services/save/slotManager";

export function loadFlags(): FlagId[] {
  try {
    const saved = loadCompressed<FlagId[]>(slotKey(FLAGS_KEY));
    return saved ?? [];
  } catch {
    return [];
  }
}

export function saveFlags(flags: FlagId[]) {
  saveCompressed(slotKey(FLAGS_KEY), flags);
}
