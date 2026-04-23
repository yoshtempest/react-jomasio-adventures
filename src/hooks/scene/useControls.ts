import { useEffect } from "react";
import type { Controls, DialogueSystem, SetPlayerMode } from "@/utils/types/sceneHooks";

type Props = {
  pushControls: (controls: Controls) => void;
  popControls: () => void;
  dialogueSystem: DialogueSystem;
  playSansTalking: () => void;
  setMode: SetPlayerMode;
};

export function useSceneControls({
  pushControls,
  popControls,
  dialogueSystem,
  playSansTalking,
  setMode,
}: Props) {
  useEffect(() => {
    setMode("explore");

    const controls = {
      onConfirm: () => {
        if (!dialogueSystem.isOpen) return false;
        dialogueSystem.next();
        playSansTalking();
        return true;
      },
    };

    pushControls(controls);

    return () => popControls();
  }, []);
}