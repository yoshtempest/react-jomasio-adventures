import { slotKey } from "@/services/save/slotManager";
import type { StoredPass } from "./types";
import { getCurrentMonth } from "./getCurrentMonth";
import { MONTHLY_PASS_KEY } from "@/data/storageKeys";

export function loadPass(): StoredPass {
  try {
    const raw = localStorage.getItem(slotKey(MONTHLY_PASS_KEY));
    if (!raw) return { month: getCurrentMonth(), claimed: [] };
    const parsed = JSON.parse(raw) as StoredPass;
    if (parsed.month !== getCurrentMonth()) {
      return { month: getCurrentMonth(), claimed: [] };
    }
    return parsed;
  } catch {
    return { month: getCurrentMonth(), claimed: [] };
  }
}
