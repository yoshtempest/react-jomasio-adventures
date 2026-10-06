import { getTotalStat } from "./getTotalStat";

export function getTotalUniversalVampirism(character: CharacterId): number {
  return getTotalStat(character, "universalVampirism");
}
