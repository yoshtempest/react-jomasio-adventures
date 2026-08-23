import { CLASS_KILLS_KEY } from "@/data/storageKeys";
import { slotKey } from "@/services/save/slotManager";

export type ClassKills = Record<NPCClass, number>;

function createDefault(): ClassKills {
  return { common: 0, rare: 0, epic: 0, boss: 0, legendary: 0 };
}

export function loadClassKills(): ClassKills {
  try {
    const raw = localStorage.getItem(slotKey(CLASS_KILLS_KEY));
    if (!raw) return createDefault();
    return JSON.parse(raw) as ClassKills;
  } catch {
    return createDefault();
  }
}

function saveClassKills(data: ClassKills): void {
  try {
    localStorage.setItem(slotKey(CLASS_KILLS_KEY), JSON.stringify(data));
  } catch {}
}

export function incrementClassKill(npcClass: NPCClass): void {
  const data = loadClassKills();
  data[npcClass] = (data[npcClass] ?? 0) + 1;
  saveClassKills(data);
}

export function getClassKills(): ClassKills {
  return loadClassKills();
}
