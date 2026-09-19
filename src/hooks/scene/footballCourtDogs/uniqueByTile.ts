import { tileKey, type DogSpot } from "./constants";

export function uniqueByTile(spots: DogSpot[]): DogSpot[] {
  const seen = new Set<string>();
  return spots.filter((spot) => {
    const key = tileKey(spot);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}