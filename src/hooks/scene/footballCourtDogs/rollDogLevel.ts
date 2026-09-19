const DOG_LEVEL_RANGE: readonly [number, number] = [5, 8];

export function rollDogLevel(): number {
  const [min, max] = DOG_LEVEL_RANGE;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
