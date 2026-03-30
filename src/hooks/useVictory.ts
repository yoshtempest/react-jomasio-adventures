import { useState, useCallback } from "react";
import { useNavigate } from "react-router";

type VictoryOptions = {
  redirectTo?: string;
};

export function useVictory({ redirectTo }: VictoryOptions = {}) {
  const [showVictory, setShowVictory] = useState(false);
  const navigate = useNavigate();

  const triggerVictory = useCallback(() => {
    setShowVictory(true);
  }, []);

  const handleContinue = useCallback(() => {
    if (redirectTo) {
      navigate(redirectTo);
    }
  }, [redirectTo, navigate]);

  return {
    showVictory,
    triggerVictory,
    handleContinue,
  };
}