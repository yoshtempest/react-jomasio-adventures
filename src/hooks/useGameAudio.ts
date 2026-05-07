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
  autoPlay = true,
  volume = 0.5,
}: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { volume: masterVolume } = useAudio();

  // 🎵 cria o áudio apenas quando o src muda
  useEffect(() => {
    const audio = new Audio(src);
    audio.loop = loop;
    audioRef.current = audio;


    if (autoPlay) {
      audio.play().catch(() => {});
    }

    return () => {
      audio.pause();
      audio.currentTime = 0;
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

  const play = () => audioRef.current?.play();
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

  // 🖱️ autoplay fallback com cleanup
  useEffect(() => {
    const handleClick = () => {
      audioRef.current?.play();
      window.removeEventListener("click", handleClick);
    };

    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("click", handleClick);
    };
  }, []);

  return {
    play,
    pause,
    stop,
    setVolume,
  };
}