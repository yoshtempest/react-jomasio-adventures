import { getTotalStat } from "./getTotalStat";


export function getTotalVampirism(character: CharacterId): number {
  return getTotalStat(character, "vampirism");
}