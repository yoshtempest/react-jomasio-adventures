type Projectile = {
  x: number;
  y: number;
};

type Props = {
  x: number;
  y: number;
  TILE_SIZE: number;
  npcType: string;
  state: "idle" | "walk" | "hit";
  direction: "left" | "right";
  projectile?: Projectile | null;
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
  projectile,
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
      {projectile && (() => {

        return (
          <img
            src="/src/assets/npcs/dish.svg"
            style={{
              position: "absolute",
              left: projectile.x,
              top: projectile.y,
              width: TILE_SIZE * 50, // deveria ser 0.6
              transform: `translate(-50%, -50%)`,
              zIndex: 9999,
              background: "red",
            }}
          />
        );
      })()}

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