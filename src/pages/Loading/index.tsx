import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router";
import { asset } from "@/utils/paths";
import { hasSave } from "@/utils/save/saveGame";
import styles from "./styles.module.css";
import { useNavbar } from "@/contexts/NavbarContext";
import { useBackgroundAudio } from "@/hooks/useBackgroundAudio";
import { useUpdate } from "@/contexts/UpdateContext";
import loading from "/assets/songs/transitions/loading.mp3";

const MIN_LOADING_MS = 2000;

export default function Loading() {
  const navigate = useNavigate();
  const { closeNavbar } = useNavbar();
  const closeNavbarRef = useRef(closeNavbar);
  closeNavbarRef.current = closeNavbar;

  const { status, checkForUpdate } = useUpdate();

  useBackgroundAudio(loading, 1);

  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"loading" | "done">("loading");
  const navigated = useRef(false);

  useEffect(() => {
    const switchTarget = sessionStorage.getItem("saveSwitchTarget");
    if (switchTarget) {
      sessionStorage.removeItem("saveSwitchTarget");
      navigate(switchTarget, { replace: true });
      return;
    }

    const start = Date.now();
    closeNavbarRef.current();

    checkForUpdate();

    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min(95, (elapsed / MIN_LOADING_MS) * 100);
      setProgress(pct);
    }, 50);

    let innerTimer: ReturnType<typeof setTimeout> | null = null;

    const timer = setTimeout(() => {
      clearInterval(interval);
      navigated.current = true;
      setProgress(100);
      setPhase("done");
      innerTimer = setTimeout(() => {
        const switchTarget = sessionStorage.getItem("saveSwitchTarget");
        if (switchTarget) {
          sessionStorage.removeItem("saveSwitchTarget");
          navigate(switchTarget, { replace: true });
        } else {
          const replayTarget = sessionStorage.getItem("replayTarget");
          if (replayTarget) {
            sessionStorage.removeItem("replayTarget");
            navigate(`/replay/${replayTarget}`, { replace: true });
          } else {
            const target = hasSave() ? "/home" : "/tutorial";
            navigate(target, { replace: true });
          }
        }
      }, 600);
    }, MIN_LOADING_MS);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
      if (innerTimer) clearTimeout(innerTimer);
    };
  }, [navigate, checkForUpdate]);

  const statusLabel =
    status === "checking" ? "Verificando atualização..." : null;

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
      {statusLabel && <p className={styles.updateStatus}>{statusLabel}</p>}
    </div>
  );
}
