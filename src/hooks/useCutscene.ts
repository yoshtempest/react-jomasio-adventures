import { useEffect, useRef } from "react";
import { useGameControls } from "@/contexts/GameControlsContext";
import { useDialogue } from "@/hooks/useDialogue";

type UseCutsceneProps = {
  dialogue: Parameters<typeof useDialogue>[0];
  autoStart?: boolean;
  playOnce?: boolean;
  onFinish?: () => void;
  playAudio?: () => void;
};

export function useCutscene({
  dialogue,
  autoStart = true,
  playOnce = true,
  onFinish,
  playAudio,
}: UseCutsceneProps) {
  const dialogueSystem = useDialogue(dialogue, onFinish);
  const { setOnConfirm } = useGameControls();

  const hasPlayed = useRef(false);

  // ▶ iniciar automaticamente
  useEffect(() => {
    if (!autoStart) return;

    if (playOnce && hasPlayed.current) return;

    dialogueSystem.start();
    playAudio?.();
    hasPlayed.current = true;
  }, []);

    const handleConfirmRef = useRef<() => void>(() => {});

    handleConfirmRef.current = () => {
    if (!dialogueSystem.isOpen) return;

    dialogueSystem.next();
    playAudio?.();
    };

  // ▶ bind no sistema de controles
  useEffect(() => {
    setOnConfirm(() => () => handleConfirmRef.current());

    return () => setOnConfirm(undefined);
  }, []);

  return {
    ...dialogueSystem,
    hasPlayed: hasPlayed.current,
  };
}