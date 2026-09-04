import { getTotalStat } from "./getTotalStat";

export function getTotalShield(character: CharacterId): number {
  return getTotalStat(character, "shield");
}