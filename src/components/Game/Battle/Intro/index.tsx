import { asset } from "@/utils/asset";
import styles from "./styles.module.css";
import { useEffect, useRef } from "react";
import { useAudio } from "@/contexts/AudioContext";

type Props = {
  playerCharacter: string;
  npcType: string;
  onSkip: () => void;
};

export function BattleIntro({ playerCharacter, npcType, onSkip }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { volume: masterVolume } = useAudio();
  const masterVolumeRef = useRef(masterVolume);
  masterVolumeRef.current = masterVolume;

  useEffect(() => {
    const audio = new Audio(
      asset("/assets/songs/soundEffects/battle/onePiece.mp3"),
    );

    audio.volume = 0.5 * (masterVolumeRef.current / 100);
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
    <div className="overlay">
      <div className={styles.left}>
        <img
          src={asset(`/assets/player/${playerCharacter}/default.svg`)}
          alt=""
        />
      </div>

      <div className={styles.vs}>VS</div>

      <div className={styles.right}>
        <img src={asset(`/assets/npcs/${npcType}/right.svg`)} alt="" />
      </div>

      <button className={styles.skip} onClick={handleSkip}>
        Pular
      </button>
    </div>
  );
}
