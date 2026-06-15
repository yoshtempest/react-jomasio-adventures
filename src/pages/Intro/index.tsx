import { useEffect, useMemo, useRef } from "react";
import styles from "./styles.module.css";
import undertale from "/assets/songs/UndertaleGameOver.m4a";
import { useGameAudio } from "@/hooks/useGameAudio";
import { asset } from "@/utils/asset";
import { useGameModeMenu } from "@/hooks/menu/useGameModeMenu";

export default function Intro() {
  const { selectedIndex, options } = useGameModeMenu();

  const backgroundAudio = useMemo(
    () => ({
      src: undertale,
      loop: true,
      volume: 0.3,
    }),
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

  return (
    <div className={`Master ${styles.image}`}>
      <img src={asset("/assets/logo.svg")} alt="logo" className={styles.logo} />

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
