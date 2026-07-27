import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router";
import { useVictory } from "@/hooks/battle/victory/useVictory";
import { useHighlight } from "@/hooks/battle/useHighlight";
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

  const [showDefeat, setShowDefeat] = useState(false);
  const [showOutro, setShowOutro] = useState<"victory" | "defeat" | null>(null);
  const [skipVictoryDelay, setSkipVictoryDelay] = useState(false);
  const [lastRewards, setLastRewards] = useState<RewardInfo | null>(null);
  const outroTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  const { highlightData, prepareHighlight, clearHighlight } = useHighlight();
  const [showHighlight, setShowHighlight] = useState(false);

  const showHighlightEnabledRef = useRef(showHighlightEnabled);
  showHighlightEnabledRef.current = showHighlightEnabled;
  const getReplayDataRef = useRef(getReplayData);
  getReplayDataRef.current = getReplayData;

  const { showVictory, triggerVictory } = useVictory({ redirectTo });

  useEffect(() => {
    if (showVictory) {
      setShowOutro("victory");
      outroTimeoutRef.current = setTimeout(() => setShowOutro(null), 2500);
      return () => clearTimeout(outroTimeoutRef.current);
    }
  }, [showVictory]);

  useEffect(() => {
    if (showDefeat) {
      setShowOutro("defeat");
      outroTimeoutRef.current = setTimeout(() => setShowOutro(null), 2500);
      return () => clearTimeout(outroTimeoutRef.current);
    }
  }, [showDefeat]);

  const handleCloseOutro = useCallback(() => {
    clearTimeout(outroTimeoutRef.current);
    setShowOutro(null);
    setSkipVictoryDelay(true);

    if (showHighlightEnabledRef.current) {
      const has = prepareHighlight(getReplayDataRef.current);
      if (has) {
        setShowHighlight(true);
      }
    }
  }, [prepareHighlight]);

  const handleCloseHighlight = useCallback(() => {
    setShowHighlight(false);
    clearHighlight();
  }, [clearHighlight]);

  const handleContinue = useCallback(() => {
    if (onVictory) onVictory();
    if (redirectTo) {
      navigate(redirectTo, {
        replace: true,
        state: { from: location.pathname },
      });
    }
  }, [onVictory, redirectTo, navigate, location.pathname]);

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
