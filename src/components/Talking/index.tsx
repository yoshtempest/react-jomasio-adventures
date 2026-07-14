import { useEffect, useRef, useState } from "react";
import { useTypewriter } from "@/hooks/interaction/useTypewriter";
import { useSettings } from "@/contexts/SettingsContext";
import { useGameControls } from "@/contexts/GameControlsContext";
import { useAudio } from "@/contexts/AudioContext";
import { resolveAsset } from "@/utils/paths";

interface Props {
  name: string;
  message: string;
  src?: string;
  soundSrc?: string;
  autoAdvanceOnSound?: boolean;
  onNext?: () => void;
  onSoundEnd?: () => void;
}

export default function Talking({ name, message, src, soundSrc, autoAdvanceOnSound, onNext, onSoundEnd }: Props) {
  const { dialogueSpeedMs } = useSettings();
  const { sfxVolume } = useAudio();
  const { displayedText, isComplete, skip } = useTypewriter(
    message,
    dialogueSpeedMs,
  );
  const { pushControls, popControls } = useGameControls();

  const [animate, setAnimate] = useState(true);
  const prevNameRef = useRef(name);

  useEffect(() => {
    if (name !== prevNameRef.current) {
      setAnimate(true);
      prevNameRef.current = name;
    }
  }, [name]);

  const handleAnimationEnd = () => setAnimate(false);

  const sfxVolumeRef = useRef(sfxVolume);
  sfxVolumeRef.current = sfxVolume;

  const isCompleteRef = useRef(isComplete);
  isCompleteRef.current = isComplete;
  const skipRef = useRef(skip);
  skipRef.current = skip;
  const onNextRef = useRef(onNext);
  onNextRef.current = onNext;
  const onSoundEndRef = useRef(onSoundEnd);
  onSoundEndRef.current = onSoundEnd;

  useEffect(() => {
    const controls = {
      onUp: () => true,
      onDown: () => true,
      onLeft: () => true,
      onRight: () => true,
      onConfirm: () => {
        if (!isCompleteRef.current) {
          skipRef.current();
          return true;
        }
        if (onNextRef.current) {
          onNextRef.current();
          return true;
        }
        return;
      },
    };

    pushControls(controls);
    return () => popControls();
  }, [pushControls, popControls]);

  useEffect(() => {
    if (!soundSrc) return;

    const audio = new Audio(resolveAsset(soundSrc));
    audio.volume = sfxVolumeRef.current / 100;
    audio.play().catch(() => {});

    if (autoAdvanceOnSound) {
      audio.addEventListener("ended", () => {
        onSoundEndRef.current?.();
      });
    }

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, [soundSrc, autoAdvanceOnSound]);

  return (
    <div className={`talkingContainer${animate ? " talkingContainer--animate" : ""}`} onAnimationEnd={handleAnimationEnd}>
      <div className="talking">
        <h1>{name}</h1>
        <h2>{displayedText}</h2>
      </div>
      {src && (
        <img className="talkingImage" src={resolveAsset(src)} alt={name} />
      )}
    </div>
  );
}
