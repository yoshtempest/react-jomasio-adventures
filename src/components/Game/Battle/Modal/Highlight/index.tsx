import { useEffect, useRef, useCallback } from "react";
import type { ReplayData } from "@/utils/types/replay";
import { useReplayPlayback } from "@/hooks/battle/recording/useReplayPlayback";
import { useReplayViewport } from "@/hooks/battle/recording/useReplayViewport";
import { useGameControlsLayer } from "@/hooks/game/useGameControlsLayer";
import { ReplayViewport } from "@/components/Game/Battle/Replay/Viewport";
import styles from "./styles.module.css";

type Props = {
  replay: ReplayData;
  onClose: () => void;
};

export function BattleHighlight({ replay, onClose }: Props) {
  const playback = useReplayPlayback(replay);
  const viewport = useReplayViewport();

  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useGameControlsLayer(
    {
      onUp: () => true,
      onDown: () => true,
      onLeft: () => true,
      onRight: () => true,
      onConfirm: () => {
        onCloseRef.current();
        return true;
      },
    },
    [],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "l" || e.key === "L") {
        onCloseRef.current();
      }
    },
    [],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (!playback.playing) {
      const timeout = setTimeout(() => {
        onCloseRef.current();
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [playback.playing]);

  if (!playback.frame) return null;

  const vpSize: ReplayViewportSize = {
    width: viewport.width,
    height: viewport.height,
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.outer}>
        <div className={styles.header}>
          <h2>Momento de Maior Dano</h2>
        </div>

        <div ref={viewport.vpRef} className={styles.vp}>
          <ReplayViewport
            replay={replay}
            frame={playback.frame}
            viewport={vpSize}
          />
        </div>

        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${playback.progress}%` }}
          />
        </div>

        <p className={styles.skipHint}>Pressione L para pular</p>
      </div>
    </div>
  );
}
