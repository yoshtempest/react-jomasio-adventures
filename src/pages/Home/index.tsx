import { useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router";
import { useGameControls } from "@/contexts/GameControlsContext";
import styles from "./styles.module.css";
import undertale from "/assets/songs/UndertaleGameOver.m4a";
import { useGameAudio } from "@/hooks/game/useGameAudio";
import { asset } from "@/utils/asset";
import { loadGame } from "@/utils/saveGame";

export default function Home() {
  const { pushControls, popControls } = useGameControls();
  const navigate = useNavigate();

  const backgroundAudio = useMemo(
    () => ({
      src: undertale,
      loop: true,
      volume: 0.3,
    }),
    [],
  );

  const audio = useGameAudio(backgroundAudio); // 🔥 pega controle
  const audioRef = useRef(audio);
  audioRef.current = audio;

  useEffect(() => {
    if (audioRef.current.isPlaying()) return;

    audioRef.current.play()?.catch(() => {});

    return () => {
      audioRef.current.stop(); // 🔥 para ao sair
    };
  }, []);

  useEffect(() => {
    pushControls({
      onConfirm: () => {
        const save = loadGame();
        if (save?.lastRoute && save.lastRoute !== "/home") {
          navigate(save.lastRoute);
        } else {
          navigate("/firstscreen");
        }
      },
    });

    return () => popControls();
  }, [navigate, pushControls, popControls]);

  return (
    <div className={`Master Home`}>
      <img src={asset("/assets/logo.svg")} alt="logo" className={styles.logo} />
      <h1>Pressione L para continuar</h1>
    </div>
  );
}
