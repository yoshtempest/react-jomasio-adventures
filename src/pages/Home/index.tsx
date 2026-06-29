import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { useGameControls } from "@/contexts/GameControlsContext";
import styles from "./styles.module.css";
import undertale from "/assets/songs/UndertaleGameOver.m4a";
import { useGameAudio } from "@/hooks/game/useGameAudio";
import { asset } from "@/utils/asset";
import { loadGame } from "@/utils/save/saveGame";
import {
  getActiveSlot,
  setActiveSlot,
  getUsedSlots,
  getAvailableSlots,
  isSlotUsed,
  clearSlot,
  hasAnySave,
  type SlotIndex,
} from "@/utils/save/slotManager";

type Screen = "menu" | "deleteConfirm" | "noSlots";

export default function Home() {
  const navigate = useNavigate();
  const { pushControls, popControls } = useGameControls();
  const [screen, setScreen] = useState<Screen>("menu");
  const [selected, setSelected] = useState(0);
  const [deleteTarget, setDeleteTarget] = useState<SlotIndex | null>(null);
  const [activeSlot, setActiveSlotState] = useState(getActiveSlot());

  const usedSlots = getUsedSlots();
  const availableSlots = getAvailableSlots();

  const backgroundAudio = useMemo(
    () => ({ src: undertale, loop: true, volume: 0.3 }),
    [],
  );

  const audio = useGameAudio(backgroundAudio);
  const audioRef = useRef(audio);
  audioRef.current = audio;

  useEffect(() => {
    if (audioRef.current.isPlaying()) return;
    audioRef.current.play()?.catch(() => {});
    return () => audioRef.current.stop();
  }, []);

  useEffect(() => {
    if (!hasAnySave()) {
      navigate("/tutorial", { replace: true });
    }
  }, [navigate]);

  const confirmAction = useRef<() => void>(() => {});
  const refresh = useRef<() => void>(() => {});
  refresh.current = () => {
    const s = getUsedSlots();
    if (s.length === 0) {
      setScreen("noSlots");
      navigate("/tutorial", { replace: true });
    }
    setActiveSlotState(getActiveSlot());
  };

  const menuOptions = useMemo(() => {
    const opts: { label: string; action: () => void }[] = [];

    opts.push({
      label: "Continuar",
      action: () => {
        const save = loadGame();
        if (
          save?.lastRoute &&
          save.lastRoute !== "/home" &&
          save.lastRoute !== "/combatTutorial" &&
          !save.lastRoute.includes("battle")
        ) {
          navigate(save.lastRoute);
        } else {
          navigate("/firstscreen");
        }
      },
    });

    if (availableSlots.length > 0) {
      opts.push({
        label: "Novo Jogo",
        action: () => {
          const freeSlot = availableSlots[0];
          setActiveSlot(freeSlot);
          clearSlot(freeSlot);
          navigate("/tutorial", { replace: true });
        },
      });
    } else {
      opts.push({
        label: "Novo Jogo",
        action: () => {
          setScreen("deleteConfirm");
          setSelected(0);
        },
      });
    }

    if (usedSlots.length > 1) {
      opts.push({
        label: `Trocar Save (Save ${activeSlot + 1})`,
        action: () => {
          const next = activeSlot === 0 ? 1 : 0;
          if (isSlotUsed(next)) {
            setActiveSlot(next);
            setActiveSlotState(next);
          }
        },
      });
    }

    return opts;
  }, [activeSlot, usedSlots, availableSlots, navigate]);

  const deleteOptions = useMemo(() => {
    const opts: { label: string; action: () => void }[] = [];
    if (isSlotUsed(0)) {
      opts.push({
        label: "Remover Save 1",
        action: () => setDeleteTarget(0),
      });
    }
    if (isSlotUsed(1)) {
      opts.push({
        label: "Remover Save 2",
        action: () => setDeleteTarget(1),
      });
    }
    opts.push({
      label: "Voltar",
      action: () => setScreen("menu"),
    });
    return opts;
  }, []);

  const handleConfirm = useCallback(() => {
    confirmAction.current();
  }, []);

  const handleUp = useCallback(() => {
    const options = screen === "menu" ? menuOptions : deleteOptions;
    setSelected((prev) => (prev > 0 ? prev - 1 : options.length - 1));
  }, [screen, menuOptions, deleteOptions]);

  const handleDown = useCallback(() => {
    const options = screen === "menu" ? menuOptions : deleteOptions;
    setSelected((prev) => (prev < options.length - 1 ? prev + 1 : 0));
  }, [screen, menuOptions, deleteOptions]);

  useEffect(() => {
    const options = screen === "menu" ? menuOptions : deleteOptions;
    if (selected >= options.length) setSelected(0);
  }, [screen, menuOptions, deleteOptions, selected]);

  useEffect(() => {
    if (deleteTarget === null) return;

    clearSlot(deleteTarget);

    if (deleteTarget === getActiveSlot()) {
      const remaining = getUsedSlots();
      if (remaining.length > 0) {
        setActiveSlot(remaining[0]);
        setActiveSlotState(remaining[0]);
      }
    }

    setDeleteTarget(null);
    setScreen("menu");
    setSelected(0);
  }, [deleteTarget]);

  useEffect(() => {
    confirmAction.current =
      screen === "menu"
        ? menuOptions[selected]?.action ?? (() => {})
        : deleteOptions[selected]?.action ?? (() => {});
  }, [screen, selected, menuOptions, deleteOptions]);

  useEffect(() => {
    pushControls({
      onUp: handleUp,
      onDown: handleDown,
      onConfirm: handleConfirm,
      blockGlobalOpen: true,
    });

    return () => popControls();
  }, [pushControls, popControls, handleUp, handleDown, handleConfirm]);

  const options = screen === "menu" ? menuOptions : deleteOptions;

  return (
    <div className={`Master Home`}>
      <img src={asset("/assets/logo.svg")} alt="logo" className={styles.logo} />

      <div className={styles.menu}>
        {options.map((opt, i) => (
          <div
            key={i}
            className={`${styles.menuItem} ${i === selected ? styles.menuItemSelected : ""}`}
          >
            {opt.label}
          </div>
        ))}
      </div>

      <p className={styles.slotInfo}>
        Save ativo: {activeSlot + 1}
        {screen === "deleteConfirm" ? " — Selecione um save para remover" : ""}
      </p>
    </div>
  );
}
