import { type DogSpot, tileKey, DOG_SPOTS, FOOTBALLCOURT_DOG_COUNT } from "./constants";
import { uniqueByTile } from "./uniqueByTile";
import { shuffle } from "./shuffle";
import { rollDogAlfa } from "./rollDogAlfa";

export function reconcileSpots(
  saved: DogSpot[],
  tombstoneTiles: Set<string>,
): DogSpot[] {
  const freeOfTombstones = (spot: DogSpot) =>
    !tombstoneTiles.has(tileKey(spot));

  const kept = uniqueByTile(saved).filter(freeOfTombstones);
  const taken = new Set(kept.map(tileKey));
  const available = DOG_SPOTS.filter(
    (spot) => !tombstoneTiles.has(tileKey(spot)) && !taken.has(tileKey(spot)),
  );

  const need = FOOTBALLCOURT_DOG_COUNT - kept.length;
  const added =
    need > 0
      ? shuffle(available)
          .slice(0, need)
          .map((spot) => ({ x: spot.x, y: spot.y, alfa: rollDogAlfa() }))
      : [];

  return [...kept, ...added];
}