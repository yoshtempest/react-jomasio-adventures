import { useState, useCallback } from "react";

export function useNameInput(onSubmit: () => void) {
  const [playerName, setPlayerName] = useState("");

  const submit = useCallback(() => {
    if (!playerName.trim()) return;

    localStorage.setItem("playerName", playerName.trim());
    onSubmit();
  }, [playerName, onSubmit]);

  return {
    playerName,
    setPlayerName,
    submit,
  };
}