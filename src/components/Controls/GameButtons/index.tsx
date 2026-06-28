import { useState, useRef, useEffect } from "react";
import styles from "./styles.module.css";
import { useGameControls } from "@/contexts/GameControlsContext";
import { useNavbar } from "@/contexts/NavbarContext";
import { usePlayer } from "@/contexts/PlayerContext";

export function GameButtons() {
  const { activeControls, closeAllMenus } = useGameControls();
  const { openNavbar } = useNavbar();
  const { player } = usePlayer();

  const [lCooldown, setLCooldown] = useState(false);
  const [bCooldown, setBCooldown] = useState(false);
  const [gCooldown, setGCooldown] = useState(false);
  const lTimerRef = useRef<NodeJS.Timeout | null>(null);
  const bTimerRef = useRef<NodeJS.Timeout | null>(null);
  const gTimerRef = useRef<NodeJS.Timeout | null>(null);

  function handleOpen() {
    if (activeControls?.onOpen) {
      activeControls.onOpen();
      return;
    }

    if (activeControls?.blockGlobalOpen && player.mode === "explore") {
      closeAllMenus();
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

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      switch (e.key) {
        case "l":
        case "L":
        case "A":
        case "Enter":
          setLCooldown(true);
          if (lTimerRef.current) clearTimeout(lTimerRef.current);
          lTimerRef.current = setTimeout(() => setLCooldown(false), 400);
          break;

        case "b":
        case "B":
        case "x":
        case "X":
        case "Delete":
          setBCooldown(true);
          if (bTimerRef.current) clearTimeout(bTimerRef.current);
          bTimerRef.current = setTimeout(() => setBCooldown(false), 600);
          break;

        case "g":
        case "G":
          setGCooldown(true);
          if (gTimerRef.current) clearTimeout(gTimerRef.current);
          gTimerRef.current = setTimeout(() => setGCooldown(false), 400);
          break;
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (lTimerRef.current) clearTimeout(lTimerRef.current);
      if (bTimerRef.current) clearTimeout(bTimerRef.current);
      if (gTimerRef.current) clearTimeout(gTimerRef.current);
    };
  }, []);

  return (
    <div className={styles.gameButtons}>
      <button
        className={`${styles.open} ${gCooldown ? styles.cooldown : ""}`}
        onPointerDown={handleOpen}
      />
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
