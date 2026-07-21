import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./styles.module.css";


const TRAINING_MAX_SECONDS = 10 * 60;

export function TrainingOverlay({ onLeave }: { onLeave: () => void }) {
  const [elapsed, setElapsed] = useState(0);
  const onLeaveRef = useRef(onLeave);
  onLeaveRef.current = onLeave;

  useEffect(() => {
    const id = setInterval(() => {
      setElapsed((prev) => {
        if (prev + 1 >= TRAINING_MAX_SECONDS) {
          clearInterval(id);
          onLeaveRef.current();
          return prev;
        }
        return prev + 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const remaining = TRAINING_MAX_SECONDS - elapsed;
  const min = Math.floor(remaining / 60);
  const sec = remaining % 60;
  const timeStr = `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;

  const handleLeave = useCallback(() => {
    onLeaveRef.current();
  }, []);

  return (
    <button
      className={styles.leaveButton}
      onClick={handleLeave}
      type="button"
    >
      Sair {timeStr}
    </button>
  );
}
