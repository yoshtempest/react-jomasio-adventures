import type { ReplayFrame } from "@/utils/types/replay";


const PLAYER_DAMAGE_TYPES = new Set(["player", "special", "crit"]);

export function getPeakDamageFrameIndex(frames: ReplayFrame[]): number {
  let bestIdx = 0;
  let bestDmg = -1;

  for (let i = 0; i < frames.length; i++) {
    const frame = frames[i];
    if (!frame) continue;
    for (const d of frame.dmg) {
      if (PLAYER_DAMAGE_TYPES.has(d.ty) && d.v > bestDmg) {
        bestDmg = d.v;
        bestIdx = i;
      }
    }
  }

  return bestIdx;
}