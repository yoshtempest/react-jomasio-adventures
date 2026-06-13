import { useEffect, useRef } from "react";
import { useTypewriter } from "@/hooks/interaction/useTypewriter";
import { useSettings } from "@/contexts/SettingsContext";
import { useGameControls } from "@/contexts/GameControlsContext";
import styles from "./styles.module.css";

interface Props {
  name: string;
  message: string;
  src?: string;
}

function resolveAsset(path?: string) {
  if (!path) return "";

  if (
    path.startsWith("http") ||
    path.startsWith(import.meta.env.BASE_URL)
  ) {
    return path;
  }

  if (path.startsWith("/")) {
    return `${import.meta.env.BASE_URL}${path.slice(1)}`;
  }

  return path;
}

export default function Talking({ name, message, src }: Props) {
  const { dialogueSpeedMs } = useSettings();
  const { displayedText, isComplete, skip } = useTypewriter(message, dialogueSpeedMs);
  const { pushControls, popControls } = useGameControls();

  const isCompleteRef = useRef(isComplete);
  isCompleteRef.current = isComplete;
  const skipRef = useRef(skip);
  skipRef.current = skip;

  useEffect(() => {
    const controls = {
      onUp: () => true,
      onDown: () => true,
      onLeft: () => true,
      onRight: () => true,
      onConfirm: () => {
        if (!isCompleteRef.current) {
          skipRef.current();
          return true;
        }
        return;
      },
    };

    pushControls(controls);
    return () => popControls();
  }, [pushControls, popControls]);

  return (
    <div className={styles.container}>
      <div className={styles.talking}>
        <h1>{name}</h1>
        <h2>{displayedText}</h2>
      </div>
      {src && (
        <img
          className={styles.image}
          src={resolveAsset(src)}
          alt={name}
        />
      )}
    </div>
  );
}
