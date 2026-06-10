import { useEffect, useRef } from "react";
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
  const pushControlsRef = useRef(pushControls);
  pushControlsRef.current = pushControls;
  const popControlsRef = useRef(popControls);
  popControlsRef.current = popControls;
  const dialogueSystemRef = useRef(dialogueSystem);
  dialogueSystemRef.current = dialogueSystem;
  const playSansTalkingRef = useRef(playSansTalking);
  playSansTalkingRef.current = playSansTalking;
  const setModeRef = useRef(setMode);
  setModeRef.current = setMode;

  useEffect(() => {
    setModeRef.current("explore");

    const controls = {
      onConfirm: () => {
        if (!dialogueSystemRef.current.isOpen) return false;
        dialogueSystemRef.current.next();
        playSansTalkingRef.current();
        return true;
      },
    };

    pushControlsRef.current(controls);

    return () => popControlsRef.current();
  }, []);
}