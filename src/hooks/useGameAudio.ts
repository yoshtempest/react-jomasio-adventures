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

  useEffect(() => {
    const audio = new Audio(src);

    audio.loop = loop;
    audio.volume = volume;

    audioRef.current = audio;

    if (autoPlay) {
      audio.play().catch(() => {
        console.log("Autoplay bloqueado");
      });
    }

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [src, loop, volume, autoPlay]);

  const play = () => {
    audioRef.current?.play();
  };

  const pause = () => {
    audioRef.current?.pause();
  };

  const stop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const setVolume = (value: number) => {
    if (audioRef.current) {
      audioRef.current.volume = value;
    }
  };

  useEffect(() => {
    const handleClick = () => {
        play();
        window.removeEventListener("click", handleClick);
    };

    window.addEventListener("click", handleClick);
    }, []);

  return {
    play,
    pause,
    stop,
    setVolume,
  };
}