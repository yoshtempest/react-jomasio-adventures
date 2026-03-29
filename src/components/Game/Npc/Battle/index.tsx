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

  return (
    <img
      src={src}
      style={{
        position: "absolute",
        width: TILE_SIZE * 1.4,
        height: TILE_SIZE * 1.4,
        left: x,
        top: y,
        transform: `translate(-10%, -20%) scaleX(${direction === "right" ? -1 : 1})`,
        zIndex: 9,
      }}
    />
  );
}