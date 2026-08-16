import { useMemo, useEffect } from "react";
import { useLatestRef } from "@/hooks/useLatestRef";
import { useGameAudio } from "@/hooks/game/useGameAudio";

export function useBackgroundAudio(src: string, volume = 0.3) {
  const config = useMemo(() => ({ src, loop: true, volume }), [src, volume]);
  const audio = useGameAudio(config);
  const audioRef = useLatestRef(audio);

  useEffect(() => {
    const controls = audioRef.current;
    if (controls.isPlaying()) return;
    controls.play()?.catch(() => {});
    return () => controls.stop();
  }, [src, audioRef]);

  return audio;
}
