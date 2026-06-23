import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router";
import { asset } from "@/utils/asset";
import { hasSave } from "@/utils/saveGame";
import styles from "./styles.module.css";

const MIN_LOADING_MS = 6000;

export default function Loading() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"loading" | "done">("loading");
  const navigated = useRef(false);

  useEffect(() => {
    const start = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min(95, (elapsed / MIN_LOADING_MS) * 100);
      setProgress(pct);
    }, 50);

    const timer = setTimeout(() => {
      clearInterval(interval);
      navigated.current = true;
      setProgress(100);
      setPhase("done");
      setTimeout(() => {
        const target = hasSave() ? "/home" : "/tutorial";
        navigate(target, { replace: true });
      }, 600);
    }, MIN_LOADING_MS);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [navigate]);

  return (
    <div
      className={styles.screen}
      style={{ backgroundImage: `url(${asset("/assets/loading.svg")})` }}
    >
      <div className={styles.barTrack}>
        <div
          className={`${styles.barFill} ${phase === "done" ? styles.barDone : ""}`}
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className={styles.label}>Carregando...</p>
    </div>
  );
}
