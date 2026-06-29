import { useCallback, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router";
import { useGameControls } from "@/contexts/GameControlsContext";
import styles from "./styles.module.css";
import undertale from "/assets/songs/UndertaleGameOver.m4a";
import { useGameAudio } from "@/hooks/game/useGameAudio";
import { asset } from "@/utils/asset";
import { loadGame } from "@/utils/save/saveGame";
import { hasAnySave } from "@/utils/save/slotManager";

export default function Home() {
  const navigate = useNavigate();
  const { pushControls, popControls } = useGameControls();

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
      return;
    }
  }, [navigate]);

  const handleConfirm = useCallback(() => {
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
  }, [navigate]);

  useEffect(() => {
    pushControls({
      onConfirm: handleConfirm,
    });

    return () => popControls();
  }, [pushControls, popControls, handleConfirm]);

  return (
    <div className={`Master Home`}>
      <img src={asset("/assets/logo.svg")} alt="logo" className={styles.logo} />
      <p className={styles.continue}>Faça o L para continuar</p>
    </div>
  );
}
