import { useMemo } from "react";
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

  useGameAudio(backgroundAudio);
}