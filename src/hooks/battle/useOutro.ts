import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router";
import { useLatestRef } from "@/hooks/useLatestRef";
import { useVictory } from "@/hooks/battle/victory/useVictory";
import { useHighlight } from "@/hooks/battle/useHighlight";
import { useTombstones } from "@/contexts/TombstoneContext";
import type { ReplayData } from "@/utils/types/replay";

type OutroProps = {
  redirectTo?: string;
  onVictory?: () => void;
  getReplayData: () => ReplayData | null;
  showHighlightEnabled: boolean;
};

export function useBattleOutro({
  redirectTo,
  onVictory,
  getReplayData,
  showHighlightEnabled,
}: OutroProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { clearPendingTombstoneSpawn } = useTombstones();

  const [showDefeat, setShowDefeat] = useState(false);
  const [showOutro, setShowOutro] = useState<"victory" | "defeat" | null>(null);
  const [skipVictoryDelay, setSkipVictoryDelay] = useState(false);
  const [lastRewards, setLastRewards] = useState<RewardInfo | null>(null);
  const outroTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  const { highlightData, prepareHighlight, clearHighlight } = useHighlight();
  const [showHighlight, setShowHighlight] = useState(false);

  const showHighlightEnabledRef = useLatestRef(showHighlightEnabled);
  const getReplayDataRef = useLatestRef(getReplayData);

  const { showVictory, triggerVictory } = useVictory({ redirectTo });

  const prepareAndShowHighlight = useCallback(() => {
    if (showHighlightEnabledRef.current) {
      const has = prepareHighlight(getReplayDataRef.current);
      if (has) {
        setShowHighlight(true);
      }
    }
  }, [prepareHighlight, getReplayDataRef, showHighlightEnabledRef]);

  useEffect(() => {
    if (!showVictory) return undefined;
    setShowOutro("victory");
    outroTimeoutRef.current = setTimeout(() => {
      setShowOutro(null);
      prepareAndShowHighlight();
    }, 2500);
    return () => clearTimeout(outroTimeoutRef.current);
  }, [showVictory, prepareAndShowHighlight]);

  useEffect(() => {
    if (!showDefeat) return undefined;
    setShowOutro("defeat");
    outroTimeoutRef.current = setTimeout(() => {
      setShowOutro(null);
      prepareAndShowHighlight();
    }, 2500);
    return () => clearTimeout(outroTimeoutRef.current);
  }, [showDefeat, prepareAndShowHighlight]);

  const handleCloseOutro = useCallback(() => {
    clearTimeout(outroTimeoutRef.current);
    setShowOutro(null);
    setSkipVictoryDelay(true);
    prepareAndShowHighlight();
  }, [prepareAndShowHighlight]);

  const handleCloseHighlight = useCallback(() => {
    setShowHighlight(false);
    clearHighlight();
  }, [clearHighlight]);

  const handleContinue = useCallback(() => {
    const wasVictory = !!onVictory;
    if (onVictory) onVictory();
    if (!wasVictory) {
      clearPendingTombstoneSpawn();
    }
    if (redirectTo) {
      void navigate(redirectTo, {
        replace: true,
        state: { from: location.pathname },
      });
    }
  }, [
    onVictory,
    redirectTo,
    navigate,
    location.pathname,
    clearPendingTombstoneSpawn,
  ]);

  return {
    showVictory,
    triggerVictory,
    showDefeat,
    setShowDefeat,
    showOutro,
    setShowOutro,
    showHighlight,
    highlightData,
    handleCloseHighlight,
    skipVictoryDelay,
    setSkipVictoryDelay,
    lastRewards,
    setLastRewards,
    handleCloseOutro,
    handleContinue,
  };
}
