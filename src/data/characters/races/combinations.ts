import type { Race } from "@/utils/types/character/race";

export type MixedPair = { a: Race; b: Race };

export function combinations(races: readonly Race[]): MixedPair[] {
  const out: MixedPair[] = [];
  for (let i = 0; i < races.length; i++) {
    for (let j = i + 1; j < races.length; j++) {
      const a = races[i]!;
      const b = races[j]!;
      out.push({ a, b });
    }
  }
  return out;
}
