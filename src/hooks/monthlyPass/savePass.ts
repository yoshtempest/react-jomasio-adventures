import { MONTHLY_PASS_KEY } from "@/data/storageKeys";
import type { StoredPass } from "./types";
import { slotKey } from "@/services/save/slotManager";


export function savePass(data: StoredPass): void {
  try {
    localStorage.setItem(slotKey(MONTHLY_PASS_KEY), JSON.stringify(data));
  } catch {}
}