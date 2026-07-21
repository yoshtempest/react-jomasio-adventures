import { useEffect, useCallback } from "react";
import type { ReplayData } from "@/utils/types/replay";
import { useReplayPlayback } from "@/hooks/battle/recording/useReplayPlayback";
import { useReplayAudio } from "@/hooks/battle/recording/useReplayAudio";
import { useReplayViewport } from "@/hooks/battle/recording/useReplayViewport";
import { ReplayHeader } from "./Header";
import { ReplayViewport } from "./Viewport";
import { ReplayControls } from "./Controls";
import { ReplayProgress } from "./Progress";
import styles from "./styles.module.css";

type Props = {
  replay: ReplayData;
  onClose: () => void;
};

export function ReplayPlayer({ replay, onClose }: Props) {
  const playback = useReplayPlayback(replay);
  const { handleRestart, handleSeek } = useReplayAudio(
    replay,
    playback.playing,
    playback.currentFrame,
  );
  const viewport = useReplayViewport();

  const onRestart = useCallback(() => {
    handleRestart();
    playback.restart();
  }, [handleRestart, playback]);

  const onSeek = useCallback(
    (frame: number) => {
      handleSeek(frame);
      playback.seek(frame);
    },
    [handleSeek, playback],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === " ") {
        e.preventDefault();
        playback.togglePlay();
      }
      if (e.key === "ArrowRight") playback.step(5);
      if (e.key === "ArrowLeft") playback.step(-5);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, playback]);

  if (!playback.frame) return null;

  const vpSize: ReplayViewportSize = {
    width: viewport.width,
    height: viewport.height,
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.outer}>
        <ReplayHeader
          npcType={replay.npcType}
          npcLevel={replay.npcLevel}
          currentTime={playback.frame.t}
          duration={replay.duration}
        />

        <div ref={viewport.vpRef} className={styles.vp}>
          <ReplayViewport
            replay={replay}
            frame={playback.frame}
            viewport={vpSize}
          />
        </div>

        <ReplayControls
          isPlaying={playback.playing}
          speed={playback.speed}
          onRestart={onRestart}
          onStepBack={() => playback.step(-5)}
          onTogglePlay={playback.togglePlay}
          onStepForward={() => playback.step(5)}
          onClose={onClose}
          onSpeedChange={playback.setSpeed}
        />

        <ReplayProgress
          currentFrame={playback.currentFrame}
          totalFrames={playback.totalFrames}
          pct={playback.progress}
          onSeek={onSeek}
        />
      </div>
    </div>
  );
}
