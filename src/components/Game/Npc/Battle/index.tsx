type Props = {
  x: number;
  y: number;
  TILE_SIZE: number;
  npcType: string;
  state: "idle" | "walk" | "hit";
  direction: "left" | "right";
  piercings?: { id: number; x: number; y: number }[];
  isExploding?: boolean;
};

export function NPCBattle({
  x,
  y,
  TILE_SIZE,
  npcType,
  state,
  direction,
  piercings = [],
  isExploding = false,
}: Props) {
  const src = isExploding
    ? "/src/assets/npcs/explosion.svg"
    : `/src/assets/npcs/${npcType}/${state}.svg`;

  const BASE_WIDTH = 1280;
  const BASE_HEIGHT = 600;
  const scaleX = window.innerWidth / BASE_WIDTH;
  const scaleY = window.innerHeight / BASE_HEIGHT;

  return (
    <div
      style={{
        position: "absolute",
        width: TILE_SIZE * 1.4,
        height: TILE_SIZE * 1.4,
        left: x * scaleX,
        top: y * scaleY,
        transform: `translate(-10%, -20%)`,
        zIndex: 9,
      }}
    >
      {/* 🧍 NPC */}
      <img
        src={src}
        style={{
          width: "100%",
          height: "100%",
          transform: `scaleX(${direction === "right" ? -1 : 1})`,
          position: "absolute",
        }}
      />

      {/* 🗡️ PIERCINGS */}
      {piercings.map((p) => (
        <img
          key={p.id}
          src="/src/assets/npcs/piercing.svg"
          style={{
            position: "absolute",
            width: TILE_SIZE * 0.4,
            height: TILE_SIZE * 0.4,
            left: "50%",
            top: "50%",
            transform: `translate(${p.x}px, ${p.y}px)`,
            pointerEvents: "none",
          }}
        />
      ))}
    </div>
  );
}