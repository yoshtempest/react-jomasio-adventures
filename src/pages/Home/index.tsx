import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router";
import { useGameControls } from "@/contexts/GameControlsContext";
import styles from "./styles.module.css";
import SOS from "@/assets/SOSFromEarth.m4a";
import { useGameAudio } from "@/hooks/useGameAudio";

export default function Home() {
  const { setOnConfirm } = useGameControls();
  const navigate = useNavigate();

  const backgroundAudio = useMemo(() => ({
    src: SOS,
    loop: true,
    volume: 1,
  }), []);

  useGameAudio(backgroundAudio);

  useEffect(() => {
    setOnConfirm(() => () => navigate("/firstscreen"));

    return () => {
      setOnConfirm(undefined);
    };
  }, []);

  return (
    <div className={`Master ${styles.image}`}>
      <img
        src="/src/assets/logo.svg"
        alt="logo"
        className={styles.logo}
      />
      <h1>Pressione A para continuar</h1>
    </div>
  );
}