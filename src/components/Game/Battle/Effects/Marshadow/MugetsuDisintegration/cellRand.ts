export function cellRand(
  id: string,
  col: number,
  row: number,
  salt: string,
): number {
  let h = 2166136261;
  const s = `${id}:${col}:${row}:${salt}`;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 4294967295;
}