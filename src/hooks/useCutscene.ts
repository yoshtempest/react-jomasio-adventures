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
    // 🎬 só controla input quando cutscene estiver aberta
    if (!dialogueSystem.isOpen) return;

    setOnConfirm(() => () => handleConfirmRef.current());

    return () => setOnConfirm(undefined);
  }, [dialogueSystem.isOpen]); // 👈 ESSENCIAL

  return {
    ...dialogueSystem,
    hasPlayed: hasPlayed.current,
  };
}