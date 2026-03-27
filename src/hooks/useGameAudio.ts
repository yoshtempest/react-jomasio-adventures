import { useEffect, useRef } from "react";

type UseGameAudioProps = {
  src: string;
  loop?: boolean;
  volume?: number;
  autoPlay?: boolean;
};

export function useGameAudio({
  src,
  loop = true,
  volume = 0.5,
  autoPlay = true,
}: UseGameAudioProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 🎵 cria o áudio apenas quando o src muda
  useEffect(() => {
    const audio = new Audio(src);
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [src]);

  // 🎛️ controla propriedades sem recriar áudio
  useEffect(() => {
    if (!audioRef.current) return;

    audioRef.current.loop = loop;
    audioRef.current.volume = volume;

    if (autoPlay) {
      audioRef.current.play().catch(() => {});
    }
  }, [loop, volume, autoPlay]);

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