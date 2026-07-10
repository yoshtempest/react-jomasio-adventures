import { useEffect, useRef } from "react";
import { useTypewriter } from "@/hooks/interaction/useTypewriter";
import { useSettings } from "@/contexts/SettingsContext";
import { useGameControls } from "@/contexts/GameControlsContext";
import { resolveAsset } from "@/utils/paths";

interface Props {
  name: string;
  message: string;
  src?: string;
  onNext?: () => void;
}

export default function Talking({ name, message, src, onNext }: Props) {
  const { dialogueSpeedMs } = useSettings();
  const { displayedText, isComplete, skip } = useTypewriter(
    message,
    dialogueSpeedMs,
  );
  const { pushControls, popControls } = useGameControls();

  const isCompleteRef = useRef(isComplete);
  isCompleteRef.current = isComplete;
  const skipRef = useRef(skip);
  skipRef.current = skip;
  const onNextRef = useRef(onNext);
  onNextRef.current = onNext;

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

  return (
    <div className="talkingContainer">
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
