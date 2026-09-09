import { BATTLE_STATS_KEY } from "@/data/storageKeys";
import { createSlotJsonStorage } from "@/utils/rewards/createSlotJsonStorage";

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

const statsStorage = createSlotJsonStorage(BATTLE_STATS_KEY, createDefault);

// Damage dealt
export function incrementDamageDealtStats(
  character: string,
  amount: number,
): void {
  const data = statsStorage.load();
  data.damageDealt.total += amount;
  data.damageDealt.perCharacter[character] =
    (data.damageDealt.perCharacter[character] ?? 0) + amount;
  statsStorage.save(data);
}

export function getDamageDealtStats(): PerCharacterStats {
  return statsStorage.load().damageDealt;
}

// Damage taken
export function incrementDamageTakenStats(
  character: string,
  amount: number,
): void {
  const data = statsStorage.load();
  data.damageTaken.total += amount;
  data.damageTaken.perCharacter[character] =
    (data.damageTaken.perCharacter[character] ?? 0) + amount;
  statsStorage.save(data);
}

export function getDamageTakenStats(): PerCharacterStats {
  return statsStorage.load().damageTaken;
}

// Misses (dodges)
export function incrementMissesStats(character: string): void {
  const data = statsStorage.load();
  data.misses.total += 1;
  data.misses.perCharacter[character] =
    (data.misses.perCharacter[character] ?? 0) + 1;
  statsStorage.save(data);
}

export function getMissesStats(): PerCharacterStats {
  return statsStorage.load().misses;
}

// Equipment drops
export function incrementEquipmentDropsStats(count: number): void {
  const data = statsStorage.load();
  data.equipmentDrops.total += count;
  statsStorage.save(data);
}

// Hits used (golpes - total of attacks + specials)
export function incrementHitsUsedStats(character: string): void {
  const data = statsStorage.load();
  data.hitsUsed.total += 1;
  data.hitsUsed.perCharacter[character] =
    (data.hitsUsed.perCharacter[character] ?? 0) + 1;
  statsStorage.save(data);
}

export function getHitsUsedStats(): PerCharacterStats {
  return statsStorage.load().hitsUsed;
}

// Specials used
export function incrementSpecialsUsedStats(character: string): void {
  const data = statsStorage.load();
  data.specialsUsed.total += 1;
  data.specialsUsed.perCharacter[character] =
    (data.specialsUsed.perCharacter[character] ?? 0) + 1;
  statsStorage.save(data);
}

export function getSpecialsUsedStats(): PerCharacterStats {
  return statsStorage.load().specialsUsed;
}

// Common attacks used
export function incrementAttacksUsedStats(character: string): void {
  const data = statsStorage.load();
  data.attacksUsed.total += 1;
  data.attacksUsed.perCharacter[character] =
    (data.attacksUsed.perCharacter[character] ?? 0) + 1;
  statsStorage.save(data);
}

export function getAttacksUsedStats(): PerCharacterStats {
  return statsStorage.load().attacksUsed;
}
