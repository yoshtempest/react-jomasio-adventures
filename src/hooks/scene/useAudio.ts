import { useMemo, useEffect, useRef } from "react";
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
  const audioControlsRef = useRef(audioControls);
  audioControlsRef.current = audioControls;

  // 🔥 toca automaticamente ao entrar na cena
  useEffect(() => {
    audioControlsRef.current.play();

    return () => {
      // 🔥 para quando sair da cena (ESSENCIAL)
      audioControlsRef.current.stop();
    };
  }, [backgroundAudio.src]);
}