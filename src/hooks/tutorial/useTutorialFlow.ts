import { useState } from "react";
import { usePlayer } from "@/contexts/PlayerContext";

export function useTutorialFlow() {
  const [showNameInput, setShowNameInput] = useState(false);

  const { setMode } = usePlayer();

  function openNameInput() {
    setShowNameInput(true);
    setMode("ui");
  }

  function closeNameInput() {
    setShowNameInput(false);
    setMode("explore");
  }

  return {
    showNameInput,
    openNameInput,
    closeNameInput,
  };
}