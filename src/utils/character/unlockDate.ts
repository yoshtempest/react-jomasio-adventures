import { CHAR_UNLOCK_DATES_KEY } from "@/data/storageKeys";
import { saveCompressed, loadCompressed } from "@/services/save/storageService";
import { slotKey } from "@/services/save/slotManager";

type UnlockDates = Record<string, string>;

export const UNLOCK_FLAG_TO_CHAR = {
  samurionUnlocked: "samuel",
  srGuaxinimUnlocked: "artur",
  ematronUnlocked: "emanuel",
  laricellUnlocked: "larissa",
  yraUnlocked: "mayra",
  kamykazeUnlocked: "camilly",
  yvelUnlocked: "lucas",
  babidiUnlocked: "lucaua",
  riquelsonUnlocked: "riquelme",
} as const satisfies Record<string, CharacterId>;

export type UnlockFlagId = keyof typeof UNLOCK_FLAG_TO_CHAR;

export function isUnlockFlag(flag: FlagId): flag is UnlockFlagId {
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
  if (!isUnlockFlag(flag)) return;
  const charId = UNLOCK_FLAG_TO_CHAR[flag];

  const dates = loadUnlockDates();
  if (dates[charId]) return;

  dates[charId] = new Date().toISOString();
  saveCompressed(slotKey(CHAR_UNLOCK_DATES_KEY), dates);
}

export function getUnlockDate(charId: string): string | null {
  const dates = loadUnlockDates();
  return dates[charId] ?? null;
}
