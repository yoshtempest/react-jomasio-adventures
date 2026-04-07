import { useRef, useCallback, useEffect } from "react";
import SansTalking from "@/assets/songs/SansTalking.mp3";

export function useSansTalking(isDialogueOpen: boolean) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  if (!audioRef.current) {
    audioRef.current = new Audio(SansTalking);
    audioRef.current.volume = 0.3;
  }

  const play = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, []);

  // sempre que o diálogo fechar, parar o áudio
  useEffect(() => {
    if (!isDialogueOpen) {
      stop();
    }
  }, [isDialogueOpen, stop]);

  return { play, stop };
}