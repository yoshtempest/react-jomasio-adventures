import { asset } from "@/utils/asset";
import styles from "./styles.module.css";
import { useEffect, useRef } from "react";

type Props = {
  playerCharacter: string;
  npcType: string;
  onSkip: () => void;
};

export function BattleIntro({
  playerCharacter,
  npcType,
  onSkip,
}: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio(
      asset("/assets/songs/soundEffects/battle/onePiece.mp3")
    );

    audio.volume = 0.7;
    audio.currentTime = 0;

    audio.play().catch(() => {
      // evita erro de autoplay bloqueado
    });

    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  const handleSkip = () => {
    // para o áudio antes de sair
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    onSkip();
  };
  return (
    <div className={styles.overlay}>
      <div className={styles.left}>
        <img
          src={asset(`/assets/player/${playerCharacter}/default.svg`)}
          alt=""
        />
      </div>

      <div className={styles.vs}>
        VS
      </div>

      <div className={styles.right}>
        <img
          src={asset(`/assets/npcs/${npcType}/right.svg`)}
          alt=""
        />
      </div>

      <button className={styles.skip} onClick={handleSkip}>
        Pular
      </button>
    </div>
  );
}