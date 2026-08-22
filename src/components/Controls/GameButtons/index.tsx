import { useState, useCallback, useEffect, useRef } from "react";

import type { UIButtonType } from "@/data/uiButtonKeys";
import { UI_BUTTON_COOLDOWNS, UI_BUTTON_KEYS } from "@/data/uiButtonKeys";
import styles from "./styles.module.css";
import { useGameControls } from "@/contexts/GameControlsContext";
import { useNavbar } from "@/contexts/NavbarContext";
import { usePlayer } from "@/contexts/PlayerContext";
import { Settings } from "lucide-react";

function useUiButtonCooldowns() {
  const [cooldowns, setCooldowns] = useState<Record<UIButtonType, boolean>>({
    confirm: false,
    cancel: false,
    open: false,
    config: false,
  });
  const timersRef = useRef<
    Partial<Record<UIButtonType, ReturnType<typeof setTimeout>>>
  >({});

  const trigger = useCallback((id: UIButtonType) => {
    setCooldowns((prev) => (prev[id] ? prev : { ...prev, [id]: true }));
    if (timersRef.current[id]) clearTimeout(timersRef.current[id]);
    timersRef.current[id] = setTimeout(() => {
      setCooldowns((prev) => ({ ...prev, [id]: false }));
      timersRef.current[id] = undefined;
    }, UI_BUTTON_COOLDOWNS[id]);
  }, []);

  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      Object.values(timers).forEach((timer) => {
        if (timer) clearTimeout(timer);
      });
    };
  }, []);

  return { cooldowns, trigger };
}

export function GameButtons() {
  const { activeControls, closeAllMenus } = useGameControls();
  const { openNavbar, openScreen, isNavOpen, screen, closeNavbar } =
    useNavbar();
  const { player } = usePlayer();
  const { cooldowns, trigger } = useUiButtonCooldowns();

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const binding = UI_BUTTON_KEYS.find((b) => b.key === e.key);
      if (!binding) return;
      if (binding.preventDefault) e.preventDefault();
      trigger(binding.id);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [trigger]);

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

  function handleConfig() {
    if (isNavOpen && screen === "config") {
      closeNavbar();
      return;
    }
    openScreen("config");
  }

  function handleConfirmDown() {
    activeControls?.onConfirm?.();
    trigger("confirm");
  }

  function handleConfirmUp() {
    activeControls?.onConfirmRelease?.();
  }

  function handleCancelDown() {
    activeControls?.onCancel?.();
    trigger("cancel");
  }

  function handleCancelUp() {
    activeControls?.onCancelRelease?.();
  }

  return (
    <div className={styles.gameButtons}>
      <div className={styles.row}>
        <button
          className={`${styles.configs} ${cooldowns.config ? styles.cooldown : ""}`}
          onPointerDown={handleConfig}
        >
          <Settings />
        </button>
        <button
          className={`${styles.open} ${cooldowns.open ? styles.cooldown : ""}`}
          onPointerDown={handleOpen}
        />
      </div>
      <div className={styles.row}>
        <button
          className={`${styles.button} ${cooldowns.cancel ? styles.cooldown : ""}`}
          onPointerDown={handleCancelDown}
          onPointerUp={handleCancelUp}
          onPointerLeave={handleCancelUp}
        >
          B
        </button>

        <button
          className={`${styles.button} ${cooldowns.confirm ? styles.cooldown : ""}`}
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
