import { useEffect, useRef } from "react";
import type {
  Controls,
  DialogueSystem,
  SetPlayerMode,
} from "@/utils/types/sceneHooks";

type Props = {
  pushControls: (controls: Controls) => () => void;
  dialogueSystem: DialogueSystem;
  playSansTalking: () => void;
  setMode: SetPlayerMode;
};

export function useSceneControls({
  pushControls,
  dialogueSystem,
  playSansTalking,
  setMode,
}: Props) {
  const pushControlsRef = useRef(pushControls);
  pushControlsRef.current = pushControls;
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
        if (!dialogueSystemRef.current.nextSoundSrc) {
          playSansTalkingRef.current();
        }
        return true;
      },
    };

    const remove = pushControlsRef.current(controls);

    return () => remove();
  }, []);
}
