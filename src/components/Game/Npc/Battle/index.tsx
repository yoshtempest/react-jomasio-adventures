type NPCState = "idle" | "walk" | "hit";

type Props = {
  x: number;
  y: number;
  TILE_SIZE: number;
  npcType: string; // 🔥 pasta do npc
  state: NPCState;
};

export function NPCBattle({
  x,
  y,
  TILE_SIZE,
  npcType,
  state,
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
        transform: "translate(-10%, -20%)",
        zIndex: 9,
      }}
    />
  );
}