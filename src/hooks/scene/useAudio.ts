import { useMemo, useEffect } from "react";
import { useLatestRef } from "@/hooks/useLatestRef";
import { useGameAudio } from "@/hooks/game/useGameAudio";
import LavenderTown from "/assets/songs/background/LavenderTown.m4a";

type Props = {
  audio?: AudioConfig;
};

const DEFAULT_AUDIO: AudioConfig = {
  src: LavenderTown,
  loop: true,
  volume: 0.5,
};

export function useSceneAudio({ audio }: Props) {
  const backgroundAudio = useMemo(() => {
    return {
      ...DEFAULT_AUDIO,
      ...audio,
    };
  }, [audio]);

  const audioControls = useGameAudio(backgroundAudio);
  const audioControlsRef = useLatestRef(audioControls);

  // 🔥 toca automaticamente ao entrar na cena
  useEffect(() => {
    const controls = audioControlsRef.current;
    controls.play();

    return () => {
      // 🔥 para quando sair da cena (ESSENCIAL)
      controls.stop();
    };
  }, [backgroundAudio.src, audioControlsRef]);
}
