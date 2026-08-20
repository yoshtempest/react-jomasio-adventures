import { useState } from "react";
import { usePlayer } from "@/contexts/PlayerContext";

export function useTutorialFlow() {
  const [showNameInput, setShowNameInput] = useState(false);
  const [showGenderChoice, setShowGenderChoice] = useState(false);

  const { setMode, setCharacter } = usePlayer();

  function openNameInput() {
    setShowNameInput(true);
    setMode("ui");
  }

  function closeNameInput() {
    setShowNameInput(false);
    setMode("explore");
  }

  function openGenderChoice() {
    setShowGenderChoice(true);
    setMode("ui");
  }

  function chooseGender(characterId: "marcelo" | "eduarda") {
    setCharacter(characterId);
    setShowGenderChoice(false);
    setMode("explore");
  }

  return {
    showNameInput,
    openNameInput,
    closeNameInput,
    showGenderChoice,
    openGenderChoice,
    chooseGender,
  };
}
