import { NO_DOGS, type DogSpot } from "./constants";
import { uniqueByTile } from "./uniqueByTile";

export function normalizeDogSpots(data: DogSpot[]): DogSpot[] {
  if (!Array.isArray(data)) return NO_DOGS;
  return uniqueByTile(
    data.filter(
      (spot) =>
        spot &&
        typeof spot.x === "number" &&
        typeof spot.y === "number" &&
        typeof spot.alfa === "boolean",
    ),
  );
}
