import { MoveUp, MoveDown, MoveLeft, MoveRight } from "lucide-react";

type Movement = {
  onUp?: () => void;
  onDown?: () => void;
  onLeft?: () => void;
  onRight?: () => void;
};

export function Movement({ onUp, onDown, onLeft, onRight }: Movement) {
  return (
    <div className="gameButtons">
      <button className="buttonGlobal" onClick={onUp}>
        <MoveUp size={16} />
      </button>

      <button className="buttonGlobal" onClick={onDown}>
        <MoveDown size={16} />
      </button>

      <button className="buttonGlobal" onClick={onLeft}>
        <MoveLeft size={16} />
      </button>

      <button className="buttonGlobal" onClick={onRight}>
        <MoveRight size={16} />
      </button>
    </div>
  );
}