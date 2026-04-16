type Direction = "up" | "down" | "left" | "right";
type Character = "marcelo" | "eduarda" | "lucas" | "samuel" | "artur" | "mayra" | "lucaua" | "riquelme" | "larissa" | "camilly" | "emanuel";

type Props = {
  character: Character;
  direction: Direction;
  gridX: number;
  gridY: number;
  TILE_SIZE: number;
  PLAYER_SIZE: number;
};

export function Player({
  character,
  direction,
  gridX,
  gridY,
  TILE_SIZE,
  PLAYER_SIZE,
}: Props) {
  const src = `/src/assets/player/${character}/movement/${direction}.svg`;

  return (
    <img
      src={src}
      style={{
        position: "absolute",
        width: PLAYER_SIZE,
        height: PLAYER_SIZE,
        objectFit: "contain",
        left: gridX * TILE_SIZE - 11,
        top: gridY * TILE_SIZE,
        transform: "translate(-10%, -20%)",
        zIndex: 10,
      }}
    />
  );
}