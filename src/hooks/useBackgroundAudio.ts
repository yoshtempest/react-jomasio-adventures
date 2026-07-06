import { useMemo, useRef, useEffect } from "react";
import { useGameAudio } from "@/hooks/game/useGameAudio";

export function useBackgroundAudio(src: string, volume = 0.3) {
  const config = useMemo(() => ({ src, loop: true, volume }), [src, volume]);
  const audio = useGameAudio(config);
  const audioRef = useRef(audio);
  audioRef.current = audio;

  useEffect(() => {
    if (audioRef.current.isPlaying()) return;
    audioRef.current.play()?.catch(() => {});
    return () => audioRef.current.stop();
  }, []);

  return audio;
}
