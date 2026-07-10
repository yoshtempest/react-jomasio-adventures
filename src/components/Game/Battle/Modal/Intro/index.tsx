import { asset, playerPath } from "@/utils/paths";
import styles from "./styles.module.css";
import { useEffect, useRef } from "react";
import { useAudio } from "@/contexts/AudioContext";
import { useGameControls } from "@/contexts/GameControlsContext";
import { sfx } from "@/utils/paths";

type Props = {
  playerCharacter: string;
  npcType: string;
  onSkip: () => void;
};

export function BattleIntro({ playerCharacter, npcType, onSkip }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { sfxVolume } = useAudio();
  const sfxVolumeRef = useRef(sfxVolume);
  sfxVolumeRef.current = sfxVolume;
  const { pushControls, popControls } = useGameControls();

  useEffect(() => {
    const audio = sfx("/battle/onePiece.mp3");

    audio.volume = 0.5 * (sfxVolumeRef.current / 100);
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

  const handleSkipRef = useRef(handleSkip);
  handleSkipRef.current = handleSkip;

  useEffect(() => {
    const controls = {
      onUp: () => true,
      onDown: () => true,
      onLeft: () => true,
      onRight: () => true,
      onConfirm: () => {
        handleSkipRef.current();
        return true;
      },
    };

    pushControls(controls);
    return () => popControls();
  }, [pushControls, popControls]);
  return (
    <div className="overlay">
      <div className={styles.left}>
        <img
          src={playerPath(`/${playerCharacter}/default.svg`)}
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
