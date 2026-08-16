import { useEffect } from "react";
import { useLatestRef } from "@/hooks/useLatestRef";
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
  const pushControlsRef = useLatestRef(pushControls);
  const dialogueSystemRef = useLatestRef(dialogueSystem);
  const playSansTalkingRef = useLatestRef(playSansTalking);
  const setModeRef = useLatestRef(setMode);

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
  }, [dialogueSystemRef, playSansTalkingRef, pushControlsRef, setModeRef]);
}
