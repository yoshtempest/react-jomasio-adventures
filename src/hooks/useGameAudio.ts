import { useEffect, useRef } from "react";
import { useAudio } from "@/contexts/AudioContext";

type Props = {
  src: string;
  loop?: boolean;
  volume?: number;
  autoPlay?: boolean;
};

export function useGameAudio({
  src,
  loop = true,
  volume = 0.5,
}: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { volume: masterVolume } = useAudio();
  const isPlaying = () => {
    return !!audioRef.current && !audioRef.current.paused;
  };

  // 🎵 cria o áudio apenas quando o src muda
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current = null;
    }

    const audio = new Audio(src);
    audio.loop = loop;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, [src]);

  // 🎛️ controla propriedades sem recriar áudio
  useEffect(() => {
    if (!audioRef.current) return;

    audioRef.current.volume =
      volume * (masterVolume / 100);

  }, [volume, masterVolume]);

  useEffect(() => {
    if (!audioRef.current) return;

    audioRef.current.loop = loop;
  }, [loop]);

  const play = async () => {
    try {
      await audioRef.current?.play();
    } catch (err) {
      // ignora AbortError
    }
  };
  const pause = () => audioRef.current?.pause();

  const stop = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
  };

  const setVolume = (value: number) => {
    if (audioRef.current) {
      audioRef.current.volume = value;
    }
  };

  return {
    play,
    pause,
    stop,
    setVolume,
    isPlaying,
  };
}