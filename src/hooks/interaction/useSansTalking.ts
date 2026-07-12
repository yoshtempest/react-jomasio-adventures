import { useRef, useCallback, useEffect } from "react";
import SansTalking from "/assets/songs/soundEffects/dialogue/sansTalking.mp3";
import { useAudio } from "@/contexts/AudioContext";

export function useSansTalking(isDialogueOpen: boolean) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { sfxVolume } = useAudio();

  if (!audioRef.current) {
    audioRef.current = new Audio(SansTalking);
  }

  useEffect(() => {
    if (!audioRef.current) return;

    // 0.3 = volume base do efeito
    audioRef.current.volume = (sfxVolume / 100) * 0.3;
  }, [sfxVolume]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, []);

  const play = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
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
