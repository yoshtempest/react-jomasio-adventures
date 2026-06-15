import styles from "./styles.module.css";
import { useEffect, useRef } from "react";
import { usePlayer } from "@/contexts/PlayerContext";
import { useSoundEffects } from "@/contexts/SoundEffectsContext";

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
  const { playSound } = useSoundEffects();
  const playSoundRef = useRef(playSound);
  playSoundRef.current = playSound;
  const hasPlayedRef = useRef(false);

  const handleBack = () => {
    playSound("run");
    onBack();
    setMode("explore");
  };
  const handleTryAgain = () => {
    playSound("tryAgain");
    onContinue();
  };

  useEffect(() => {
    if (isOpen && !hasPlayedRef.current) {
      hasPlayedRef.current = true;
      playSoundRef.current("defeat");
    }

    if (!isOpen) {
      hasPlayedRef.current = false;
    }
  }, [isOpen]);

  const onBackRef = useRef(onBack);
  onBackRef.current = onBack;
  const setModeRef = useRef(setMode);
  setModeRef.current = setMode;

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key.toLowerCase() === "l") {
        onContinue();
      }
      if (e.key === "x" || e.key === "Esc") {
        onBackRef.current();
        setModeRef.current("explore");
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
