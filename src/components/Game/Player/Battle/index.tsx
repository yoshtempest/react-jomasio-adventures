type PlayerState = "idle" | "walk" | "attack" | "jump" | "crouched" | "special";
type Direction = "left" | "right" | "up" | "down";
type Character = "marcelo" | "eduarda" | "lucas" | "samuel" | "artur" | "mayra" | "lucaua" | "riquelme" | "larissa" | "camilly" | "emanuel";


type Props = {
  x: number;
  y: number;
  PLAYER_SIZE: number;
  state: PlayerState;
  direction: Direction;
  character: Character;
};

export function PlayerBattle({
  x,
  y,
  PLAYER_SIZE,
  state,
  direction,
  character,
}: Props) {
  const src = new URL(
    `/src/assets/player/${character}/inFight/${state}.svg`,
    import.meta.url
  ).href;

  const BASE_WIDTH = 1280;
  const BASE_HEIGHT = 600;
  const scaleX = window.innerWidth / BASE_WIDTH;
  const scaleY = window.innerHeight / BASE_HEIGHT;

  // PLAYER_SIZE vira escala relativa
  const SCALE = PLAYER_SIZE / BASE_HEIGHT;

  const WIDTH = BASE_WIDTH * SCALE;
  const HEIGHT = BASE_HEIGHT * SCALE;


  return (
    <div
      style={{
        position: "absolute",
        width: WIDTH,
        height: HEIGHT,
        left: x * scaleX,
        top: y * scaleY,
        transform: "translate(-50%, -30%)", // centraliza melhor no chão
        zIndex: 10,
        overflow: "visible", // importante pra não cortar o ataque
      }}
    >
      <img
        src={src}
        style={{
          position: "absolute",
          width: "auto",
          height: "100%",
          left: "50%",
          bottom: 0,
          transform: `
            translateX(-50%) 
            scaleX(${direction === "left" ? -1 : 1})
          `,
          pointerEvents: "none",
        }}
      />
    </div>
  );
}