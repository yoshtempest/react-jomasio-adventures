import { useState, useRef } from "react";
import styles from "./styles.module.css";
import { useGameControls } from "@/contexts/GameControlsContext";
import { useNavbar } from "@/contexts/NavbarContext";
import { usePlayer } from "@/contexts/PlayerContext";

export function GameButtons() {
  const { activeControls } = useGameControls();
  const { openNavbar } = useNavbar();
  const { player } = usePlayer();

  const [lCooldown, setLCooldown] = useState(false);
  const [bCooldown, setBCooldown] = useState(false);
  const lTimerRef = useRef<NodeJS.Timeout | null>(null);
  const bTimerRef = useRef<NodeJS.Timeout | null>(null);

  function handleOpen() {
    if (activeControls?.onOpen) {
      activeControls.onOpen();
      return;
    }

    if (!activeControls?.blockGlobalOpen && player.mode === "explore") {
      openNavbar();
    }
  }

  function handleConfirmDown() {
    activeControls?.onConfirm?.();
    setLCooldown(true);
    if (lTimerRef.current) clearTimeout(lTimerRef.current);
    lTimerRef.current = setTimeout(() => setLCooldown(false), 400);
  }

  function handleConfirmUp() {
    activeControls?.onConfirmRelease?.();
  }

  function handleCancelDown() {
    activeControls?.onCancel?.();
    setBCooldown(true);
    if (bTimerRef.current) clearTimeout(bTimerRef.current);
    bTimerRef.current = setTimeout(() => setBCooldown(false), 600);
  }

  function handleCancelUp() {
    activeControls?.onCancelRelease?.();
  }

  return (
    <div className={styles.gameButtons}>
      <button className={styles.open} onPointerDown={handleOpen} />
      <div className={styles.row}>
        <button
          className={`${styles.button} ${bCooldown ? styles.cooldown : ""}`}
          onPointerDown={handleCancelDown}
          onPointerUp={handleCancelUp}
          onPointerLeave={handleCancelUp}
        >
          B
        </button>

        <button
          className={`${styles.button} ${lCooldown ? styles.cooldown : ""}`}
          onPointerDown={handleConfirmDown}
          onPointerUp={handleConfirmUp}
          onPointerLeave={handleConfirmUp}
        >
          L
        </button>
      </div>
    </div>
  );
}
