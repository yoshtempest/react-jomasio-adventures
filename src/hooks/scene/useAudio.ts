import { useMemo, useEffect } from "react";
import { useGameAudio } from "@/hooks/useGameAudio";
import LavenderTown from "/assets/songs/LavenderTown.m4a";
import type { AudioConfig } from "@/utils/types/sceneHooks";

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

  // 🔥 toca automaticamente ao entrar na cena
  useEffect(() => {
    audioControls.play();

    return () => {
      // 🔥 para quando sair da cena (ESSENCIAL)
      audioControls.stop();
    };
  }, [backgroundAudio.src]);
}