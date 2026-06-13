import { useState, useRef } from "react";
import styles from './styles.module.css';
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

  function handleConfirm() {
    activeControls?.onConfirm?.();
    setLCooldown(true);
    if (lTimerRef.current) clearTimeout(lTimerRef.current);
    lTimerRef.current = setTimeout(() => setLCooldown(false), 400);
  }

  function handleCancel() {
    activeControls?.onCancel?.();
    setBCooldown(true);
    if (bTimerRef.current) clearTimeout(bTimerRef.current);
    bTimerRef.current = setTimeout(() => setBCooldown(false), 600);
  }

  return (
    <div className={styles.gameButtons}>
      <button className={styles.open} onPointerDown={handleOpen} />
      <div className={styles.row}>
        <button
          className={`${styles.button} ${bCooldown ? styles.cooldown : ""}`}
          onPointerDown={handleCancel}
        >
          B
        </button>

        <button
          className={`${styles.button} ${lCooldown ? styles.cooldown : ""}`}
          onPointerDown={handleConfirm}
        >
          L
        </button>
      </div>
    </div>
  );
}
