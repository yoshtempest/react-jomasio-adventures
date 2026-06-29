import { TITLES } from "@/data/titles";
import type { TitleProgress, TitlesData } from "@/utils/types/player/titles";
import { TITLES_KEY } from "@/data/storageKeys";
import { saveCompressed, loadCompressed } from "@/utils/save/storage";
import { slotKey } from "@/utils/save/slotManager";

export function getDefaultProgress(): Record<string, TitleProgress> {
  const progress: Record<string, TitleProgress> = {};
  for (const id of Object.keys(TITLES)) {
    progress[id] = { current: 0, level: 0 };
  }
  return progress;
}

export function getDefaultData(): TitlesData {
  return {
    equippedId: null,
    totalKills: 0,
    progress: getDefaultProgress(),
  };
}

export function loadData(): TitlesData {
  try {
    const parsed = loadCompressed<Partial<TitlesData>>(slotKey(TITLES_KEY));
    if (!parsed) return getDefaultData();

    const progress = getDefaultProgress();
    if (parsed.progress) {
      for (const id of Object.keys(progress)) {
        const saved = parsed.progress[id];
        if (saved) {
          progress[id] = {
            current: saved.current ?? 0,
            level: saved.level ?? 0,
          };
        }
      }
    }

    return {
      equippedId:
        parsed.equippedId && parsed.equippedId in TITLES
          ? parsed.equippedId
          : null,
      totalKills: parsed.totalKills ?? 0,
      progress,
    };
  } catch {
    return getDefaultData();
  }
}

export function saveData(data: TitlesData) {
  saveCompressed(slotKey(TITLES_KEY), data);
}
