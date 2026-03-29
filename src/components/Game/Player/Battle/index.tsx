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

  return (
    <img
      src={src}
      style={{
        position: "absolute",
        width: PLAYER_SIZE,
        height: PLAYER_SIZE,
        left: x,
        top: y,
        transform: `translate(-10%, -20%) scaleX(${direction === "left" ? -1 : 1})`,
        zIndex: 10,
      }}
    />
  );
}