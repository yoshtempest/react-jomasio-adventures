import { CHAR_UNLOCK_DATES_KEY } from "@/data/storageKeys";
import { saveCompressed, loadCompressed } from "@/utils/save/storage";
import { slotKey } from "@/utils/save/slotManager";

type UnlockDates = Record<string, string>;

export const UNLOCK_FLAG_TO_CHAR: Record<string, CharacterId> = {
  samurionUnlocked: "samuel",
  srGuaxinimUnlocked: "artur",
  ematronUnlocked: "emanuel",
  laricellUnlocked: "larissa",
  yraUnlocked: "mayra",
  kamykazeUnlocked: "camilly",
  yvelUnlocked: "lucas",
  babidiUnlocked: "lucaua",
  riquelsonUnlocked: "riquelme",
};

export function isUnlockFlag(flag: FlagId): flag is FlagId & keyof typeof UNLOCK_FLAG_TO_CHAR {
  return flag in UNLOCK_FLAG_TO_CHAR;
}

function loadUnlockDates(): UnlockDates {
  try {
    return loadCompressed<UnlockDates>(slotKey(CHAR_UNLOCK_DATES_KEY)) ?? {};
  } catch {
    return {};
  }
}

export function saveUnlockDate(flag: FlagId): void {
  const charId = UNLOCK_FLAG_TO_CHAR[flag];
  if (!charId) return;

  const dates = loadUnlockDates();
  if (dates[charId]) return;

  dates[charId] = new Date().toISOString();
  saveCompressed(slotKey(CHAR_UNLOCK_DATES_KEY), dates);
}

export function getUnlockDate(charId: string): string | null {
  const dates = loadUnlockDates();
  return dates[charId] ?? null;
}
