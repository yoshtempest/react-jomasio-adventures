import { getTotalStat } from "./getTotalStat";

export function getTotalReflect(character: CharacterId): number {
  return getTotalStat(character, "reflect");
}