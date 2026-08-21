import type { BestiaryEntryData } from "@/utils/types/player/bestiary";

type BestiaryInput = Omit<BestiaryEntryData, "npcType">;

export function createBestiary(
  entries: Record<string, BestiaryInput>,
): Record<string, BestiaryEntryData> {
  return Object.fromEntries(
    Object.entries(entries).map(([key, value]) => [
      key,
      { ...value, npcType: key },
    ]),
  );
}
