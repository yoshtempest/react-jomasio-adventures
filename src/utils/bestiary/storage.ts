import type { BestiarySaveData, BestiarySaveEntry } from "@/utils/types/player/bestiary";
import { BESTIARY_NPC_ORDER } from "@/data/bestiary";
import { BESTIARY_KEY } from "@/data/storageKeys";
import { slotKey } from "@/utils/save/slotManager";

function createDefaultEntry(): BestiarySaveEntry {
  return { encountered: false, kills: 0 };
}

function createDefaultData(): BestiarySaveData {
  const data: BestiarySaveData = {};
  for (const npcType of BESTIARY_NPC_ORDER) {
    data[npcType] = createDefaultEntry();
  }
  return data;
}

function migrateEntry(entry: Partial<BestiarySaveEntry>): BestiarySaveEntry {
  return {
    encountered: entry.encountered ?? false,
    kills: entry.kills ?? 0,
  };
}

export function loadBestiary(): BestiarySaveData {
  try {
    const raw = localStorage.getItem(slotKey(BESTIARY_KEY));
    if (!raw) return createDefaultData();
    const parsed = JSON.parse(raw) as Record<string, Partial<BestiarySaveEntry>>;
    const data: BestiarySaveData = {};
    for (const npcType of BESTIARY_NPC_ORDER) {
      const entry = parsed[npcType];
      data[npcType] = entry ? migrateEntry(entry) : createDefaultEntry();
    }
    return data;
  } catch {
    return createDefaultData();
  }
}

export function saveBestiary(data: BestiarySaveData): void {
  try {
    localStorage.setItem(slotKey(BESTIARY_KEY), JSON.stringify(data));
  } catch {
    // ignore
  }
}
