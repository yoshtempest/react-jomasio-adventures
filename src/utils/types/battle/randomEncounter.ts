import type { SlotScopedKey } from "@/services/save/slotManager";

export type EncounterDef = {
  route: string;
  weight: number;
};

export type RandomEncounterConfig = {
  storageKey: SlotScopedKey;
  blockedTiles?: { x: number; y: number }[];
  encounters: EncounterDef[];
  npcLevelRange?: readonly [number, number];
  encounterChance?: number;
  alfaChance?: number;
  locationId?: string;
};
