export function createItems<T extends Record<string, Record<string, unknown>>>(
  items: T,
) {
  return Object.fromEntries(
    Object.entries(items).map(([id, item]) => [id, { id, ...item }]),
  ) as {
    [K in keyof T]: T[K] & { id: K };
  };
}
