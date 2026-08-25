import type { SlotScopedKey } from "@/services/save/slotManager";

export type EncounterDef = {
  route: string;
  weight: number;
};

export type RandomEncounterConfig = {
  storageKey: SlotScopedKey;
  blockedTiles?: { x: number; y: number }[];
  encounters: EncounterDef[];
  encounterChance?: number;
  alfaChance?: number;
};
