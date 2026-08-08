import { useEffect, useCallback, useState, useRef } from "react";
import type { ReplayData } from "@/utils/types/replay";
import { useReplayPlayback } from "@/hooks/battle/recording/useReplayPlayback";
import { useReplayAudio } from "@/hooks/battle/recording/useReplayAudio";
import { useReplayViewport } from "@/hooks/battle/recording/useReplayViewport";
import { useGameControlsLayer } from "@/hooks/game/useGameControlsLayer";
import { ReplayHeader } from "./Header";
import { ReplayViewport } from "./Viewport";
import { ReplayControls } from "./Controls";
import { ReplayProgress } from "./Progress";
import styles from "./styles.module.css";

type Props = {
  replay: ReplayData;
  onClose: () => void;
};

const TOTAL = 9;

export function ReplayPlayer({ replay, onClose }: Props) {
  const playback = useReplayPlayback(replay);
  const { handleRestart, handleSeek } = useReplayAudio(
    replay,
    playback.playing,
    playback.currentFrame,
  );
  const viewport = useReplayViewport();

  const [selectedIndex, setSelectedIndex] = useState(2);
  const selectedIndexRef = useRef(selectedIndex);
  selectedIndexRef.current = selectedIndex;

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

  const triggerAction = useCallback(
    (index: number) => {
      switch (index) {
        case 0:
          onRestart();
          break;
        case 1:
          playback.step(-5);
          break;
        case 2:
          playback.togglePlay();
          break;
        case 3:
          playback.step(5);
          break;
        case 4:
          playback.setSpeed(0.5);
          break;
        case 5:
          playback.setSpeed(1);
          break;
        case 6:
          playback.setSpeed(2);
          break;
        case 7:
          playback.setSpeed(4);
          break;
        case 8:
          onClose();
          break;
      }
    },
    [onRestart, playback, onClose],
  );

  const triggerActionRef = useRef(triggerAction);
  triggerActionRef.current = triggerAction;

  useGameControlsLayer(
    {
      onLeft: () => {
        setSelectedIndex((i) => (i - 1 + TOTAL) % TOTAL);
        return true;
      },
      onRight: () => {
        setSelectedIndex((i) => (i + 1) % TOTAL);
        return true;
      },
      onConfirm: () => {
        triggerActionRef.current(selectedIndexRef.current);
        return true;
      },
      onCancel: () => {
        onClose();
        return true;
      },
    },
    [onClose],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

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
          selectedIndex={selectedIndex}
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
