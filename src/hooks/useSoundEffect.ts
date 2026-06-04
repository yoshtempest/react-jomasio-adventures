import { useEffect, useRef } from "react";
import { useAudio } from "@/contexts/AudioContext";

type Props = {
  src: string;
  volume?: number;
};

export function useSoundEffect({
  src,
  volume = 1,
}: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { volume: masterVolume } = useAudio();

  useEffect(() => {
    const audio = new Audio(src);

    // pré-carrega o arquivo
    audio.preload = "auto";

    audio.volume = volume * (masterVolume / 100);

    audio.load();

    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, [src]);

  useEffect(() => {
    if (!audioRef.current) return;

    audioRef.current.volume =
      volume * (masterVolume / 100);
  }, [volume, masterVolume]);

  const play = async () => {
    if (!audioRef.current) return;

    try {
      audioRef.current.currentTime = 0;

      await audioRef.current.play();
    } catch (err) {
      console.error(err);
    }
  };

  return {
    play,
  };
}