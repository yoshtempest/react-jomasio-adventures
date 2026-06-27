import { DEATHS_KEY } from "@/data/storageKeys";

export type DeathData = {
  total: number;
  perCharacter: Record<string, number>;
};

function createDefault(): DeathData {
  return { total: 0, perCharacter: {} };
}

function loadDeaths(): DeathData {
  try {
    const raw = localStorage.getItem(DEATHS_KEY);
    if (!raw) return createDefault();
    return JSON.parse(raw) as DeathData;
  } catch {
    return createDefault();
  }
}

function saveDeaths(data: DeathData): void {
  try {
    localStorage.setItem(DEATHS_KEY, JSON.stringify(data));
  } catch {}
}

export function incrementDeath(character: string): void {
  const data = loadDeaths();
  data.total += 1;
  data.perCharacter[character] = (data.perCharacter[character] ?? 0) + 1;
  saveDeaths(data);
}

export function getDeaths(): DeathData {
  return loadDeaths();
}
