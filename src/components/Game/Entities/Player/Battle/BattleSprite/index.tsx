interface BattleSpriteProps {
  src: string;
  className?: string;
  blinkDuration?: string;
  transform: string;
  transformOrigin?: string;
  onError: () => void;
}

export function BattleSprite({
  src,
  className = "",
  blinkDuration,
  transform,
  transformOrigin,
  onError,
}: BattleSpriteProps) {
  return (
    <img
      src={src}
      onError={onError}
      className={className}
      style={{
        animationDuration: blinkDuration,
        position: "absolute",
        width: "auto",
        height: "100%",
        left: "50%",
        bottom: 0,
        transform,
        transformOrigin,
        pointerEvents: "none",
      }}
      alt=""
    />
  );
}