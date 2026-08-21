import { useEffect, useRef } from "react";
import { useGameControls } from "@/contexts/GameControlsContext";
import { useLatestRef } from "@/hooks/useLatestRef";
import { useDialogue } from "@/hooks/interaction/useDialogue";
import { usePlayer } from "@/contexts/PlayerContext";

type Props = {
  dialogue: Parameters<typeof useDialogue>[0];
  autoStart?: boolean;
  playOnce?: boolean;
  onFinish?: () => void;
  playAudio?: () => void;
  onBeforeNext?: (dialogue: Dialogue) => boolean;
};

export function useCutscene({
  dialogue,
  autoStart = true,
  playOnce = true,
  onFinish,
  playAudio,
  onBeforeNext,
}: Props) {
  const { player } = usePlayer();
  const dialogueSystem = useDialogue(dialogue, onFinish);
  const { pushControls } = useGameControls();

  const hasPlayed = useRef(false);

  const dialogueSystemRef = useLatestRef(dialogueSystem);
  const playAudioRef = useLatestRef(playAudio);

  // ▶ iniciar automaticamente
  useEffect(() => {
    if (!autoStart) return;

    if (playOnce && hasPlayed.current) return;

    dialogueSystemRef.current.start();
    if (!dialogueSystemRef.current.nextSoundSrc) {
      playAudioRef.current?.();
    }
    hasPlayed.current = true;
  }, [autoStart, playOnce, dialogueSystemRef, playAudioRef]);

  // ▶ handler estável
  const handleConfirmRef = useRef<() => void>(() => {});

  handleConfirmRef.current = () => {
    if (!dialogueSystem.isOpen) return;

    if (player.mode === "ui") return;

    const shouldContinue = onBeforeNext?.(dialogueSystem.dialogue!);

    if (shouldContinue === false) return;

    dialogueSystemRef.current.next();
    if (!dialogueSystemRef.current.nextSoundSrc) {
      playAudioRef.current?.();
    }
  };

  const pushControlsRef = useLatestRef(pushControls);

  // 🔥 CORREÇÃO AQUI
  useEffect(() => {
    if (!dialogueSystem.isOpen) return;

    if (player.mode === "ui") return;

    const remove = pushControlsRef.current({
      onConfirm: () => handleConfirmRef.current(),
    });

    return () => remove();
  }, [dialogueSystem.isOpen, player.mode, pushControlsRef]);

  return {
    ...dialogueSystem,
    hasPlayed: hasPlayed.current,
  };
}
