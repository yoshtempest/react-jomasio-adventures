import { npcPath, playerPath } from "@/utils/paths";
import styles from "./styles.module.css";
import { useEffect, useRef } from "react";
import { useAudio } from "@/contexts/AudioContext";
import { useGameControls } from "@/contexts/GameControlsContext";
import { useSoundEffects } from "@/contexts/SoundEffectsContext";
import { usePlayer } from "@/contexts/PlayerContext";
import { FleeButton } from "@/components/Game/Battle/FleeButton";
import { sfx } from "@/utils/paths";

type Props = {
  playerCharacter: string;
  npcType: string;
  onSkip: () => void;
  onFlee: () => void;
};

export function BattleIntro({
  playerCharacter,
  npcType,
  onSkip,
  onFlee,
}: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { sfxVolume } = useAudio();
  const sfxVolumeRef = useRef(sfxVolume);
  sfxVolumeRef.current = sfxVolume;
  const { pushControls } = useGameControls();
  const { playSound } = useSoundEffects();
  const { setMode } = usePlayer();

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

  const handleFlee = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    playSound("run");
    setMode("explore");
    onFlee();
  };

  const handleSkipRef = useRef(handleSkip);
  handleSkipRef.current = handleSkip;
  const handleFleeRef = useRef(handleFlee);
  handleFleeRef.current = handleFlee;

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
      onCancel: () => {
        handleFleeRef.current();
        return true;
      },
    };

    const remove = pushControls(controls);
    return remove;
  }, [pushControls]);
  return (
    <div className="overlay">
      <div className={styles.left}>
        <img src={playerPath(`/${playerCharacter}/default.svg`)} alt="" />
      </div>

      <div className={styles.vs}>VS</div>

      <div className={styles.right}>
        <img
          src={npcPath(`/${npcType}/right.svg`)}
          alt=""
          onError={(e) => {
            const img = e.currentTarget;

            if (img.dataset.fallback === "default") {
              img.dataset.fallback = "walk";
              img.src = npcPath(`/${npcType}/walk.svg`);
            } else if (img.dataset.fallback === "walk") {
              img.dataset.fallback = "right";
              img.src = npcPath(`/${npcType}/right.svg`);
            }
          }}
          data-fallback="default"
        />
      </div>

      <button className={styles.skip} onClick={handleSkip}>
        Pular
      </button>

      <div className={styles.fleeContainer}>
        <FleeButton onClick={handleFlee} />
      </div>
    </div>
  );
}
