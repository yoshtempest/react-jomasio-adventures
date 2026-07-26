import styles from "./styles.module.css";
import { useEffect, useRef, useState, useCallback } from "react";
import { usePlayer } from "@/contexts/PlayerContext";
import { useSoundEffects } from "@/contexts/SoundEffectsContext";
import { useGameControls } from "@/contexts/GameControlsContext";
import { formatDuration } from "@/utils/formatDuration";
import { ActivePotionDisplay } from "@/components/ActivePotionDisplay";
import { FleeButton } from "@/components/Game/Battle/FleeButton";

type Option = "retry" | "flee";

type Props = {
  isOpen: boolean;
  title?: string;
  onContinue: () => void;
  onBack: () => void;
  progress: number;
  elapsed: number;
  bestTime: number;
};

export function DefeatModal({
  isOpen,
  title = "Derrota",
  onContinue,
  onBack,
  progress,
  elapsed,
  bestTime,
}: Props) {
  const [selected, setSelected] = useState<Option>("retry");
  const { setMode } = usePlayer();
  const { playSound } = useSoundEffects();
  const { pushControls, popControls } = useGameControls();
  const hasPlayedRef = useRef(false);

  const onContinueRef = useRef(onContinue);
  onContinueRef.current = onContinue;
  const onBackRef = useRef(onBack);
  onBackRef.current = onBack;
  const setModeRef = useRef(setMode);
  setModeRef.current = setMode;

  const executeSelected = useCallback(() => {
    if (selected === "retry") {
      playSound("tryAgain");
      onContinueRef.current();
    } else {
      playSound("run");
      onBackRef.current();
      setModeRef.current("explore");
    }
  }, [selected, playSound]);

  const selectNext = useCallback(() => {
    setSelected((prev) => (prev === "retry" ? "flee" : "retry"));
  }, []);

  const selectPrev = useCallback(() => {
    setSelected((prev) => (prev === "flee" ? "retry" : "flee"));
  }, []);

  useEffect(() => {
    if (isOpen && !hasPlayedRef.current) {
      hasPlayedRef.current = true;
      playSound("defeat");
    }

    if (!isOpen) {
      hasPlayedRef.current = false;
      setSelected("retry");
    }
  }, [isOpen, playSound]);

  const onConfirmRef = useRef(executeSelected);
  onConfirmRef.current = executeSelected;

  useEffect(() => {
    if (!isOpen) return;

    pushControls({
      onLeft: selectPrev,
      onRight: selectNext,
      onConfirm: () => {
        onConfirmRef.current();
        return true;
      },
      onCancel: () => {
        playSound("run");
        onBackRef.current();
        setModeRef.current("explore");
      },
    });

    return () => popControls();
  }, [isOpen, selectPrev, selectNext, pushControls, popControls, playSound]);

  if (!isOpen) return null;

  return (
    <div className="overlay">
      <div className={`modal ${styles.modal}`}>
        <h1>{title}</h1>
        <div className={styles.progressSection}>
          <p className={styles.label}>Progresso na batalha</p>
          <div className={styles.bar}>
            <div
              className={styles.fill}
              style={{ width: `${progress * 100}%` }}
            />
          </div>
          <p className={styles.text}>{(progress * 100).toFixed(0)}%</p>
        </div>
        <div className={styles.timeSection}>
          <p className={styles.timeRow}>
            <span className={styles.timeLabel}>Tempo:</span>
            <span>{formatDuration(elapsed)}</span>
          </p>
          <p className={styles.timeRow}>
            <span className={styles.timeLabel}>Melhor tempo:</span>
            <span>{bestTime > 0 ? formatDuration(bestTime) : "0:00"}</span>
          </p>
        </div>
        <ActivePotionDisplay />
        <div className={styles.buttonContainer}>
          <button
            className={`${styles.button} ${selected === "retry" ? styles.active : ""}`}
            onClick={executeSelected}
          >
            Tentar novamente
          </button>
          <div>
            <FleeButton
              onClick={executeSelected}
              isSelected={selected === "flee"}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
