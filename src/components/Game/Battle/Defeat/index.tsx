import styles from "./styles.module.css";
import { useEffect, useRef } from "react";
import { usePlayer } from "@/contexts/PlayerContext";
import { asset } from "@/utils/asset";

type Props = {
  isOpen: boolean;
  title?: string;
  onContinue: () => void;
  onBack: () => void;
};

export function DefeatModal({
  isOpen,
  title = "Derrota",
  onContinue,
  onBack,
}: Props) {
  const { setMode } = usePlayer();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasPlayedRef = useRef(false);
  const runAudioRef = useRef<HTMLAudioElement | null>(null);
  const tryAgainAudioRef = useRef<HTMLAudioElement | null>(null);
  useEffect(() => {
    if (!runAudioRef.current) {
      runAudioRef.current = new Audio(
        asset("/assets/songs/soundEffects/player/run.mp3")
      );
    }
  }, []);
  useEffect(() => {
    if (!tryAgainAudioRef.current) {
      tryAgainAudioRef.current = new Audio(
        asset("/assets/songs/soundEffects/player/tryAgain.mp3")
      );
    }
  }, []);

  const handleBack = () => {
    if (runAudioRef.current) {
      runAudioRef.current.currentTime = 0;
      runAudioRef.current.play().catch(() => {});
    }

    onBack();
    setMode("explore");
  };
  const handleTryAgain = () => {
    if (tryAgainAudioRef.current) {
      tryAgainAudioRef.current.currentTime = 0;
      tryAgainAudioRef.current.play().catch(() => {});
    }

    onContinue();
  };

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(
        asset("/assets/songs/soundEffects/player/defeat.mp3")
      );
    }

    if (isOpen && !hasPlayedRef.current) {
      hasPlayedRef.current = true;

      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }

    if (!isOpen) {
      hasPlayedRef.current = false;
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key.toLowerCase() === "l") {
        onContinue();
      }
      if (e.key === "x" || e.key === "Esc") {
        onBack();
        setMode("explore");
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onContinue]);

  if (!isOpen) return null;

  return (
    <div className="overlay">
      <div className={`modal ${styles.modal}`}>
        <h1>{title}</h1>
        <div className={styles.buttonContainer}>
          <button className={styles.button} onClick={handleTryAgain}>
            Tentar novamente
          </button>
          <button className={styles.button} onClick={handleBack}>
            Fugir
          </button>
        </div>
      </div>
    </div>
  );
}