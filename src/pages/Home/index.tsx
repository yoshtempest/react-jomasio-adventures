import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router";
import { useGameControls } from "@/contexts/GameControlsContext";
import styles from "./styles.module.css";
import SOS from "/assets/songs/SOSFromEarth.m4a";
import { useGameAudio } from "@/hooks/useGameAudio";
import { asset } from "@/utils/asset";
import { loadGame } from "@/utils/saveGame";

export default function Home() {
  const { pushControls, popControls } = useGameControls();
  const navigate = useNavigate();

  const backgroundAudio = useMemo(() => ({
    src: SOS,
    loop: true,
    volume: 0.3,
  }), []);

  useGameAudio(backgroundAudio);

  useEffect(() => {
    pushControls({
      onConfirm: () => {
        const save = loadGame();
        if (save) {
          navigate(save.lastRoute);
        } else {
          navigate("/firstscreen");
        }
      },
    });

    return () => popControls();
  }, [navigate, pushControls, popControls]);

  return (
    <div className={`Master ${styles.image}`}>
      <img
        src={asset("/assets/logo.svg")}
        alt="logo"
        className={styles.logo}
      />
      <h1>Pressione L para continuar</h1>
    </div>
  );
}