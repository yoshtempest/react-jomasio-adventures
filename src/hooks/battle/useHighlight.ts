import { useCallback, useState } from "react";
import type { ReplayData, ReplayFrame } from "@/utils/types/replay";

const HIGHLIGHT_DURATION_MS = 5000;
const FRAME_INTERVAL_MS = 100;
const HIGHLIGHT_FRAMES = HIGHLIGHT_DURATION_MS / FRAME_INTERVAL_MS;

const PLAYER_DAMAGE_TYPES = new Set(["player", "special", "crit"]);

function getPeakDamageFrameIndex(frames: ReplayFrame[]): number {
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

function extractHighlightFrames(
  replayData: ReplayData,
): ReplayData | null {
  const { frames } = replayData;
  if (frames.length === 0) return null;

  const peakIdx = getPeakDamageFrameIndex(frames);
  const halfWindow = Math.floor(HIGHLIGHT_FRAMES / 2);
  const start = Math.max(0, peakIdx - halfWindow);
  const end = Math.min(frames.length, start + HIGHLIGHT_FRAMES);
  const actualStart = Math.max(0, end - HIGHLIGHT_FRAMES);

  const highlightFrames = frames.slice(actualStart, end);

  return {
    ...replayData,
    id: `highlight_${Date.now()}`,
    frames: highlightFrames,
    duration:
      (highlightFrames[highlightFrames.length - 1]?.t ?? 0) -
      (highlightFrames[0]?.t ?? 0),
  };
}

export function useHighlight() {
  const [highlightData, setHighlightData] = useState<ReplayData | null>(null);

  const prepareHighlight = useCallback(
    (getReplayData: () => ReplayData | null) => {
      const data = getReplayData();
      if (!data || data.frames.length < 5) {
        setHighlightData(null);
        return false;
      }
      const highlight = extractHighlightFrames(data);
      setHighlightData(highlight);
      return highlight !== null;
    },
    [],
  );

  const clearHighlight = useCallback(() => {
    setHighlightData(null);
  }, []);

  return { highlightData, prepareHighlight, clearHighlight };
}
