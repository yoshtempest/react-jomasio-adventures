import { useEffect, useRef } from "react";
import { useAudio } from "@/contexts/AudioContext";
import { useLatestRef } from "@/hooks/useLatestRef";
import { resolveAsset } from "@/utils/paths";

type Props = {
  src: string;
  loop?: boolean;
  volume?: number;
};

export function useGameAudio({ src, loop = true, volume = 0.5 }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { bgmVolume } = useAudio();
  const loopRef = useLatestRef(loop);
  const volumeRef = useLatestRef(volume);
  const bgmVolumeRef = useLatestRef(bgmVolume);

  const isPlaying = () => {
    return !!audioRef.current && !audioRef.current.paused;
  };

  useEffect(() => {
    const audio = new Audio(resolveAsset(src));

    audio.loop = loopRef.current;
    audio.preload = "auto";

    audio.volume = volumeRef.current * (bgmVolumeRef.current / 100);

    audio.load();

    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, [src, bgmVolumeRef, loopRef, volumeRef]);

  useEffect(() => {
    if (!audioRef.current) return;

    audioRef.current.volume = volume * (bgmVolume / 100);
  }, [volume, bgmVolume]);

  useEffect(() => {
    if (!audioRef.current) return;

    audioRef.current.loop = loop;
  }, [loop]);

  const play = async () => {
    if (!audioRef.current) return;

    try {
      await audioRef.current.play();
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
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
