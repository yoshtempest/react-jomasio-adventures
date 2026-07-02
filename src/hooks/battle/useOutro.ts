import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router";
import { useVictory } from "@/hooks/useVictory";

type OutroProps = {
  redirectTo?: string;
  onVictory?: () => void;
};

export function useBattleOutro({ redirectTo, onVictory }: OutroProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const [showDefeat, setShowDefeat] = useState(false);
  const [showOutro, setShowOutro] = useState<"victory" | "defeat" | null>(null);
  const [skipVictoryDelay, setSkipVictoryDelay] = useState(false);
  const [lastRewards, setLastRewards] = useState<RewardInfo | null>(null);
  const outroTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

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
  }, []);

  function handleContinue() {
    if (onVictory) onVictory();
    if (redirectTo) {
      navigate(redirectTo, { state: { from: location.pathname } });
    }
  }

  return {
    showVictory,
    triggerVictory,
    showDefeat,
    setShowDefeat,
    showOutro,
    setShowOutro,
    skipVictoryDelay,
    setSkipVictoryDelay,
    lastRewards,
    setLastRewards,
    handleCloseOutro,
    handleContinue,
  };
}
