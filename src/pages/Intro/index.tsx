import { useEffect, useMemo } from "react";
import styles from "./styles.module.css";
import undertale from "/assets/songs/UndertaleGameOver.m4a";
import { useGameAudio } from "@/hooks/useGameAudio";
import { asset } from "@/utils/asset";
import { useGameModeMenu } from "@/hooks/menu/useGameModeMenu";

export default function Intro() {
  const { selectedIndex, options } = useGameModeMenu();

  const backgroundAudio = useMemo(() => ({
    src: undertale,
    loop: true,
    volume: 0.3,
  }), []);

  const audio = useGameAudio(backgroundAudio);

  useEffect(() => {
    if (audio.isPlaying()) return;

    audio.play()?.catch(() => {});
    return () => audio.stop();
  }, []);

  return (
    <div className={`Master ${styles.image}`}>
      <img
        src={asset("/assets/logo.svg")}
        alt="logo"
        className={styles.logo}
      />

      <div className={styles.menu}>
        {options.map((option, index) => (
          <div
            key={option.label}
            className={`${styles.option} ${
              selectedIndex === index ? styles.selected : ""
            }`}
          >
            {option.label}
          </div>
        ))}
      </div>
    </div>
  );
}