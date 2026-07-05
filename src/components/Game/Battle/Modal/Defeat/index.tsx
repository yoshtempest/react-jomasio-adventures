import styles from "./styles.module.css";
import { useEffect, useRef, useState, useCallback } from "react";
import { usePlayer } from "@/contexts/PlayerContext";
import { useSoundEffects } from "@/contexts/SoundEffectsContext";
import { useGameControls } from "@/contexts/GameControlsContext";
import { asset } from "@/utils/asset";
import { useActivePotion } from "@/hooks/useActivePotion";

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

function formatTime(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return `${min}:${sec.toString().padStart(2, "0")}`;
}

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
  const activePotion = useActivePotion();
  const { pushControls, popControls } = useGameControls();
  const playSoundRef = useRef(playSound);
  playSoundRef.current = playSound;
  const hasPlayedRef = useRef(false);

  const onContinueRef = useRef(onContinue);
  onContinueRef.current = onContinue;
  const onBackRef = useRef(onBack);
  onBackRef.current = onBack;
  const setModeRef = useRef(setMode);
  setModeRef.current = setMode;

  const executeSelected = useCallback(() => {
    if (selected === "retry") {
      playSoundRef.current("tryAgain");
      onContinueRef.current();
    } else {
      playSoundRef.current("run");
      onBackRef.current();
      setModeRef.current("explore");
    }
  }, [selected]);

  const selectNext = useCallback(() => {
    setSelected((prev) => (prev === "retry" ? "flee" : "retry"));
  }, []);

  const selectPrev = useCallback(() => {
    setSelected((prev) => (prev === "flee" ? "retry" : "flee"));
  }, []);

  useEffect(() => {
    if (isOpen && !hasPlayedRef.current) {
      hasPlayedRef.current = true;
      playSoundRef.current("defeat");
    }

    if (!isOpen) {
      hasPlayedRef.current = false;
      setSelected("retry");
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    pushControls({
      onLeft: selectPrev,
      onRight: selectNext,
      onConfirm: executeSelected,
      onCancel: () => {
        playSoundRef.current("run");
        onBackRef.current();
        setModeRef.current("explore");
      },
    });

    return () => popControls();
  }, [isOpen, executeSelected, selectPrev, selectNext, pushControls, popControls]);

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
            <span>{formatTime(elapsed)}</span>
          </p>
          <p className={styles.timeRow}>
            <span className={styles.timeLabel}>Melhor tempo:</span>
            <span>{bestTime > 0 ? formatTime(bestTime) : "0:00"}</span>
          </p>
        </div>
        {activePotion && (
          <div className={styles.potionSection}>
            <img
              src={asset(activePotion.image)}
              alt={activePotion.name}
              className={styles.potionImage}
            />
            <span className={styles.potionName}>{activePotion.name}</span>
            <span className={styles.potionTimer}>
              {formatTime(activePotion.remainingMs)}
            </span>
          </div>
        )}
        <div className={styles.buttonContainer}>
          <button
            className={`${styles.button} ${selected === "retry" ? styles.active : ""}`}
            onClick={executeSelected}
          >
            Tentar novamente
          </button>
          <button
            className={`${styles.button} ${selected === "flee" ? styles.active : ""}`}
            onClick={executeSelected}
          >
            Fugir
          </button>
        </div>
      </div>
    </div>
  );
}
