export function rollNpcLevel(
  range: readonly [number, number] | undefined,
): number | undefined {
  if (!range) return undefined;
  const [min, max] = range;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
