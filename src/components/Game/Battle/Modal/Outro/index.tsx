import { useEffect, useRef } from "react";
import { playerPath } from "@/utils/paths";
import { getOutroLine } from "@/data/battle/outro";
import { useTypewriter } from "@/hooks/interaction/useTypewriter";
import { useSettings } from "@/contexts/SettingsContext";
import { useGameControls } from "@/contexts/GameControlsContext";

type Props = {
  character: string;
  type: "victory" | "defeat";
  onNext?: () => void;
};

export function BattleOutro({ character, type, onNext }: Props) {
  const title = type === "victory" ? "Vitória" : "Derrota";
  const message = getOutroLine(character, type);

  const { dialogueSpeedMs } = useSettings();
  const { displayedText, isComplete, skip } = useTypewriter(message, dialogueSpeedMs);
  const { pushControls, popControls } = useGameControls();

  const isCompleteRef = useRef(isComplete);
  isCompleteRef.current = isComplete;
  const skipRef = useRef(skip);
  skipRef.current = skip;
  const onNextRef = useRef(onNext);
  onNextRef.current = onNext;

  useEffect(() => {
    pushControls({
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
    });
    return () => popControls();
  }, [pushControls, popControls]);

  return (
    <div className="overlay">
      <div className="talkingContainer">
        <div className="talking">
          <h1>{title}</h1>
          <h2>{displayedText}</h2>
        </div>
        <img
          className="talkingImage"
          src={playerPath(`/${character}/${type}.svg`)}
          alt={character}
        />
      </div>
    </div>
  );
}
