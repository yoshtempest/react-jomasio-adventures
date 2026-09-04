import { useCallback, useState } from "react";
import type { ReplayData } from "@/utils/types/replay";
import { extractHighlightFrames } from "./extractHighlightFrames";


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
