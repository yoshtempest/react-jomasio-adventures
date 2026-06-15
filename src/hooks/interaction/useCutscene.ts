import { useEffect, useRef } from "react";
import { useGameControls } from "@/contexts/GameControlsContext";
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
  const { pushControls, popControls } = useGameControls();

  const hasPlayed = useRef(false);

  const dialogueSystemRef = useRef(dialogueSystem);
  dialogueSystemRef.current = dialogueSystem;
  const playAudioRef = useRef(playAudio);
  playAudioRef.current = playAudio;

  // ▶ iniciar automaticamente
  useEffect(() => {
    if (!autoStart) return;

    if (playOnce && hasPlayed.current) return;

    dialogueSystemRef.current.start();
    playAudioRef.current?.();
    hasPlayed.current = true;
  }, [autoStart, playOnce]);

  // ▶ handler estável
  const handleConfirmRef = useRef<() => void>(() => {});

  handleConfirmRef.current = () => {
    if (!dialogueSystem.isOpen) return;

    if (player.mode === "ui") return;

    const shouldContinue = onBeforeNext?.(dialogueSystem.dialogue);

    if (shouldContinue === false) return;

    dialogueSystemRef.current.next();
    playAudioRef.current?.();
  };

  const pushControlsRef = useRef(pushControls);
  pushControlsRef.current = pushControls;
  const popControlsRef = useRef(popControls);
  popControlsRef.current = popControls;

  // 🔥 CORREÇÃO AQUI
  useEffect(() => {
    if (!dialogueSystem.isOpen) return;

    if (player.mode === "ui") return;

    pushControlsRef.current({
      onConfirm: () => handleConfirmRef.current(),
    });

    return () => popControlsRef.current();
  }, [dialogueSystem.isOpen, player.mode]);

  return {
    ...dialogueSystem,
    hasPlayed: hasPlayed.current,
  };
}
