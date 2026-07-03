export type EncounterDef = {
  route: string;
  weight: number;
};

export type RandomEncounterConfig = {
  storageKey: string;
  blockedTiles?: { x: number; y: number }[];
  encounters: EncounterDef[];
  encounterChance?: number;
};