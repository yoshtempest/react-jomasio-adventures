type GameButtonsProps = {
  onConfirm?: () => void;
  onCancel?: () => void;
};

export function GameButtons({ onConfirm, onCancel }: GameButtonsProps) {
  return (
    <div className="gameButtons">
      <button className="buttonGlobal" onClick={onCancel}>
        B
      </button>

      <button className="buttonGlobal" onClick={onConfirm}>
        A
      </button>
    </div>
  );
}