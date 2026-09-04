import type { ReplayData } from "@/utils/types/replay";
import { getPeakDamageFrameIndex } from "./getPeakDamageFrameIndex";
import { FIVE_THOUSAND_MS, ONE_HUNDRED_MS } from "@/data/ms";


const HIGHLIGHT_DURATION_MS = FIVE_THOUSAND_MS;
const FRAME_INTERVAL_MS = ONE_HUNDRED_MS;
const HIGHLIGHT_FRAMES = HIGHLIGHT_DURATION_MS / FRAME_INTERVAL_MS;

export function extractHighlightFrames(replayData: ReplayData): ReplayData | null {
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