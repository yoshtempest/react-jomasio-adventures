type Props = {
  x: number;
  y: number;
  TILE_SIZE: number;
  npcType: string;
  state: "idle" | "walk" | "hit";
  direction: "left" | "right";
};

export function NPCBattle({
  x,
  y,
  TILE_SIZE,
  npcType,
  state,
  direction,
}: Props) {
  const src = `/src/assets/npcs/${npcType}/${state}.svg`;

  const BASE_WIDTH = 1280;
  const BASE_HEIGHT = 600;
  const scaleX = window.innerWidth / BASE_WIDTH;
  const scaleY = window.innerHeight / BASE_HEIGHT;

  return (
    <img
      src={src}
      style={{
        position: "absolute",
        width: TILE_SIZE * 1.4,
        height: TILE_SIZE * 1.4,
        left: x * scaleX,
        top: y * scaleY,
        transform: `translate(-10%, -20%) scaleX(${direction === "right" ? -1 : 1})`,
        zIndex: 9,
      }}
    />
  );
}