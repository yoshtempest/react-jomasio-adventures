import { FLAGS_KEY } from "@/data/storageKeys";
import { saveCompressed, loadCompressed } from "@/utils/storage";

export function loadFlags(): FlagId[] {
  try {
    const saved = loadCompressed<FlagId[]>(FLAGS_KEY);
    return saved ?? [];
  } catch {
    return [];
  }
}

export function saveFlags(flags: FlagId[]) {
  saveCompressed(FLAGS_KEY, flags);
}
