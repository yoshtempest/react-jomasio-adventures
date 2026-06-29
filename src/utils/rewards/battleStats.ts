import { BATTLE_STATS_KEY } from "@/data/storageKeys";
import { slotKey } from "@/utils/save/slotManager";

type PerCharacterStats = {
  total: number;
  perCharacter: Record<string, number>;
};

type BattleStatsData = {
  damageDealt: PerCharacterStats;
  damageTaken: PerCharacterStats;
  misses: PerCharacterStats;
  equipmentDrops: { total: number };
  hitsUsed: PerCharacterStats;
  specialsUsed: PerCharacterStats;
  attacksUsed: PerCharacterStats;
};

function createDefaultPerChar(): PerCharacterStats {
  return { total: 0, perCharacter: {} };
}

function createDefault(): BattleStatsData {
  return {
    damageDealt: createDefaultPerChar(),
    damageTaken: createDefaultPerChar(),
    misses: createDefaultPerChar(),
    equipmentDrops: { total: 0 },
    hitsUsed: createDefaultPerChar(),
    specialsUsed: createDefaultPerChar(),
    attacksUsed: createDefaultPerChar(),
  };
}

function loadStats(): BattleStatsData {
  try {
    const raw = localStorage.getItem(slotKey(BATTLE_STATS_KEY));
    if (!raw) return createDefault();
    return JSON.parse(raw) as BattleStatsData;
  } catch {
    return createDefault();
  }
}

function saveStats(data: BattleStatsData): void {
  try {
    localStorage.setItem(slotKey(BATTLE_STATS_KEY), JSON.stringify(data));
  } catch {}
}

// Damage dealt
export function incrementDamageDealtStats(character: string, amount: number): void {
  const data = loadStats();
  data.damageDealt.total += amount;
  data.damageDealt.perCharacter[character] = (data.damageDealt.perCharacter[character] ?? 0) + amount;
  saveStats(data);
}

export function getDamageDealtStats(): PerCharacterStats {
  return loadStats().damageDealt;
}

// Damage taken
export function incrementDamageTakenStats(character: string, amount: number): void {
  const data = loadStats();
  data.damageTaken.total += amount;
  data.damageTaken.perCharacter[character] = (data.damageTaken.perCharacter[character] ?? 0) + amount;
  saveStats(data);
}

export function getDamageTakenStats(): PerCharacterStats {
  return loadStats().damageTaken;
}

// Misses (dodges)
export function incrementMissesStats(character: string): void {
  const data = loadStats();
  data.misses.total += 1;
  data.misses.perCharacter[character] = (data.misses.perCharacter[character] ?? 0) + 1;
  saveStats(data);
}

export function getMissesStats(): PerCharacterStats {
  return loadStats().misses;
}

// Equipment drops
export function incrementEquipmentDropsStats(count: number): void {
  const data = loadStats();
  data.equipmentDrops.total += count;
  saveStats(data);
}

export function getEquipmentDropsStats(): { total: number } {
  return loadStats().equipmentDrops;
}

// Hits used (golpes - total of attacks + specials)
export function incrementHitsUsedStats(character: string): void {
  const data = loadStats();
  data.hitsUsed.total += 1;
  data.hitsUsed.perCharacter[character] = (data.hitsUsed.perCharacter[character] ?? 0) + 1;
  saveStats(data);
}

export function getHitsUsedStats(): PerCharacterStats {
  return loadStats().hitsUsed;
}

// Specials used
export function incrementSpecialsUsedStats(character: string): void {
  const data = loadStats();
  data.specialsUsed.total += 1;
  data.specialsUsed.perCharacter[character] = (data.specialsUsed.perCharacter[character] ?? 0) + 1;
  saveStats(data);
}

export function getSpecialsUsedStats(): PerCharacterStats {
  return loadStats().specialsUsed;
}

// Common attacks used
export function incrementAttacksUsedStats(character: string): void {
  const data = loadStats();
  data.attacksUsed.total += 1;
  data.attacksUsed.perCharacter[character] = (data.attacksUsed.perCharacter[character] ?? 0) + 1;
  saveStats(data);
}

export function getAttacksUsedStats(): PerCharacterStats {
  return loadStats().attacksUsed;
}
