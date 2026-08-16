import { useRef, useCallback } from "react";
import { useAudio } from "@/contexts/AudioContext";
import { useLatestRef } from "@/hooks/useLatestRef";

export function useSFXPool() {
  const { sfxVolume } = useAudio();
  const sfxVolumeRef = useLatestRef(sfxVolume);

  const poolRef = useRef(new Map<string, HTMLAudioElement>());

  const playSFX = useCallback((src: string, volume = 1) => {
    const resolved = `${import.meta.env.BASE_URL}${src.replace(/^\//, "")}`;
    let audio = poolRef.current.get(resolved);

    if (!audio) {
      audio = new Audio(resolved);
      poolRef.current.set(resolved, audio);
    }

    audio.pause();
    audio.currentTime = 0;
    audio.volume = volume * (sfxVolumeRef.current / 100);
    audio.play().catch(() => {});
  }, [sfxVolumeRef]);

  return { playSFX };
}
