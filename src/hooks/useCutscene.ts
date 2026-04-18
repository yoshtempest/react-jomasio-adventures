import { useEffect, useRef } from "react";
import { useGameControls } from "@/contexts/GameControlsContext";
import { useDialogue } from "@/hooks/interaction/useDialogue";

type UseCutsceneProps = {
  dialogue: Parameters<typeof useDialogue>[0];
  autoStart?: boolean;
  playOnce?: boolean;
  onFinish?: () => void;
  playAudio?: () => void;
  onBeforeNext?: (dialogue: any) => boolean;
};

export function useCutscene({
  dialogue,
  autoStart = true,
  playOnce = true,
  onFinish,
  playAudio,
  onBeforeNext,
}: UseCutsceneProps) {
  const dialogueSystem = useDialogue(dialogue, onFinish);
  const { pushControls, popControls } = useGameControls();

  const hasPlayed = useRef(false);

  // ▶ iniciar automaticamente
  useEffect(() => {
    if (!autoStart) return;

    if (playOnce && hasPlayed.current) return;

    dialogueSystem.start();
    playAudio?.();
    hasPlayed.current = true;
  }, []);

  // ▶ handler estável
  const handleConfirmRef = useRef<() => void>(() => {});

  handleConfirmRef.current = () => {
    if (!dialogueSystem.isOpen) return;

    const shouldContinue = onBeforeNext?.(dialogueSystem.dialogue);

    if (shouldContinue === false) return;

    dialogueSystem.next();
    playAudio?.();
  };

  // 🔥 CORREÇÃO AQUI
  useEffect(() => {
    if (!dialogueSystem.isOpen) return;

    pushControls({
      onConfirm: () => handleConfirmRef.current(),
    });

    return () => popControls();
  }, [dialogueSystem.isOpen]);

  return {
    ...dialogueSystem,
    hasPlayed: hasPlayed.current,
  };
}