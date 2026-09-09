import { DEATHS_KEY } from "@/data/storageKeys";
import { createSlotJsonStorage } from "@/utils/rewards/createSlotJsonStorage";

export type DeathData = {
  total: number;
  perCharacter: Record<string, number>;
};

const deathsStorage = createSlotJsonStorage(DEATHS_KEY, (): DeathData => ({
  total: 0,
  perCharacter: {},
}));

export function incrementDeath(character: string): void {
  const data = deathsStorage.load();
  data.total += 1;
  data.perCharacter[character] = (data.perCharacter[character] ?? 0) + 1;
  deathsStorage.save(data);
}

export function getDeaths(): DeathData {
  return deathsStorage.load();
}
