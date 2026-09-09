import { CLASS_KILLS_KEY } from "@/data/storageKeys";
import { createSlotJsonStorage } from "@/utils/rewards/createSlotJsonStorage";

export type ClassKills = Record<NPCClass, number>;

const classKillsStorage = createSlotJsonStorage(
  CLASS_KILLS_KEY,
  (): ClassKills => ({
    common: 0,
    rare: 0,
    epic: 0,
    boss: 0,
    legendary: 0,
  }),
);

export function loadClassKills(): ClassKills {
  return classKillsStorage.load();
}

export function incrementClassKill(npcClass: NPCClass): void {
  const data = classKillsStorage.load();
  data[npcClass] = (data[npcClass] ?? 0) + 1;
  classKillsStorage.save(data);
}

export function getClassKills(): ClassKills {
  return classKillsStorage.load();
}
