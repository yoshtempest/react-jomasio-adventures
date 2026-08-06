import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./styles.module.css";
import { usePlayer } from "@/contexts/PlayerContext";
import {
  applyPlayerStatus,
  type NewPlayerStatus,
} from "@/gameRules/battle/status/statusEffects";

const TRAINING_MAX_SECONDS = 10 * 60;

const STATUS_LABELS: Record<NewPlayerStatus, string> = {
  burn: "Queimação",
  paralyze: "Paralisia",
  blind: "Cegueira",
  confuse: "Confusão",
  freeze: "Congelamento",
};

export function TrainingOverlay({ onLeave }: { onLeave: () => void }) {
  const [elapsed, setElapsed] = useState(0);
  const onLeaveRef = useRef(onLeave);
  onLeaveRef.current = onLeave;

  const { setPlayer } = usePlayer();

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

  const applyStatus = useCallback(
    (status: NewPlayerStatus) => {
      setPlayer((p) => applyPlayerStatus(p, status));
    },
    [setPlayer],
  );

  return (
    <>
      <button className={styles.leaveButton} onClick={handleLeave} type="button">
        Sair {timeStr}
      </button>
      <div className={styles.statusPanel}>
        {Object.entries(STATUS_LABELS).map(([status, label]) => (
          <button
            key={status}
            className={styles.statusButton}
            onClick={() => applyStatus(status as NewPlayerStatus)}
            type="button"
          >
            {label}
          </button>
        ))}
      </div>
    </>
  );
}
