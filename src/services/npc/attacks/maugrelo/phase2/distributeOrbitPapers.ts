import type { MaugreloAI } from "../state";

export function distributeOrbitPapers(ai: MaugreloAI, count: number): void {
  ai.orbitPapers = Array.from({ length: count }, (_, i) => ({
    id: ai.paperIdCounter++,
    angle: (Math.PI * 2 * i) / count,
  }));
}