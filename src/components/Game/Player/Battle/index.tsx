type PlayerState = "idle" | "walk" | "punch" | "jump" | "crouched" | "special";
type Direction = "left" | "right" | "up" | "down";

type Props = {
  x: number;
  y: number;
  PLAYER_SIZE: number;
  state: PlayerState;
  direction: Direction;
};

export function PlayerBattle({
  x,
  y,
  PLAYER_SIZE,
  state,
  direction,
}: Props) {
  const src = new URL(
    `/src/assets/player/inFight/${state}.svg`,
    import.meta.url
  ).href;

  const BASE_WIDTH = 1280;
  const BASE_HEIGHT = 600;
  const scaleX = window.innerWidth / BASE_WIDTH;
  const scaleY = window.innerHeight / BASE_HEIGHT;

  return (
    <img
      src={src}
      style={{
        position: "absolute",
        width: PLAYER_SIZE,
        height: PLAYER_SIZE,
        left: x * scaleX,
        top: y * scaleY,
        transform: `translate(-10%, -20%) scaleX(${direction === "left" ? -1 : 1})`,
        zIndex: 10,
      }}
    />
  );
}