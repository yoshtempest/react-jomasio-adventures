import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import type { ReplayData } from "@/utils/types/replay";

export function useReplayPlayback(replay: ReplayData) {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);

  const intervalRef =
    useRef<ReturnType<typeof setInterval> | null>(null);

  const totalFrames = replay.frames.length;
  const frame = replay.frames[currentFrame];

  const step = useCallback(
    (amount: number) => {
      setCurrentFrame((previous) => {
        const next = previous + amount;

        if (next >= totalFrames) {
          setPlaying(false);
          return totalFrames - 1;
        }

        return Math.max(0, next);
      });
    },
    [totalFrames],
  );

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    if (playing && currentFrame < totalFrames - 1) {
      intervalRef.current = setInterval(
        () => step(1),
        100 / speed,
      );
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [
    playing,
    speed,
    currentFrame,
    totalFrames,
    step,
  ]);

  const restart = useCallback(() => {
    setCurrentFrame(0);
    setPlaying(true);
  }, []);

  const seek = useCallback((frame: number) => {
    setCurrentFrame(frame);
    setPlaying(false);
  }, []);

  const togglePlay = useCallback(() => {
    setPlaying((value) => !value);
  }, []);

  return {
    currentFrame,
    frame,
    totalFrames,
    playing,
    speed,
    progress:
      totalFrames > 1
        ? (currentFrame / (totalFrames - 1)) * 100
        : 0,

    step,
    restart,
    seek,
    togglePlay,
    setSpeed,
  };
}