import { useEffect, useRef } from "react";
import { useAudio } from "@/contexts/AudioContext";

type Props = {
  src: string;
  loop?: boolean;
  volume?: number;
};

export function useGameAudio({
  src,
  loop = true,
  volume = 0.5,
}: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { volume: masterVolume } = useAudio();
  const loopRef = useRef(loop);
  loopRef.current = loop;
  const volumeRef = useRef(volume);
  volumeRef.current = volume;
  const masterVolumeRef = useRef(masterVolume);
  masterVolumeRef.current = masterVolume;

  const isPlaying = () => {
    return !!audioRef.current && !audioRef.current.paused;
  };

  useEffect(() => {
    const audio = new Audio(src);

    audio.loop = loopRef.current;
    audio.preload = "auto";

    audio.volume =
      volumeRef.current * (masterVolumeRef.current / 100);

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

  useEffect(() => {
    if (!audioRef.current) return;

    audioRef.current.loop = loop;
  }, [loop]);

  const play = async () => {
    if (!audioRef.current) return;

    try {
      await audioRef.current.play();
    } catch (err) {
      console.error(err);
    }
  };

  const pause = () => {
    audioRef.current?.pause();
  };

  const stop = () => {
    if (!audioRef.current) return;

    audioRef.current.pause();
    audioRef.current.currentTime = 0;
  };

  const setVolume = (value: number) => {
    if (!audioRef.current) return;

    audioRef.current.volume = value;
  };

  return {
    play,
    pause,
    stop,
    setVolume,
    isPlaying,
  };
}