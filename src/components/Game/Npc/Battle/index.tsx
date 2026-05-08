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
  npcPhase?: number;
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
  npcPhase = 1,
}: Props) {

  const BASE_WIDTH = 1280;
  const BASE_HEIGHT = 600;
  const scaleX = window.innerWidth / BASE_WIDTH;
  const scaleY = window.innerHeight / BASE_HEIGHT;

  const sizeMultiplier = npcType === "deise" && npcPhase === 2 ? 3 : 1.4;

  const getSprite = () => {
    if (npcType === "deise") {
      if (npcPhase === 2) {
        return `/assets/npcs/deise2/${state}.svg`;
      }
      return `/assets/npcs/deise/${state}.svg`;
    }

    // fallback padrão
    return `/assets/npcs/${npcType}/${state}.svg`;
  };

  const basePath = getSprite();

  const src = isExploding
    ? "/assets/npcs/explosion.svg"
    : `${basePath}`;

  return (
    <div
      style={{
        position: "absolute",
        width: TILE_SIZE * sizeMultiplier,
        height: TILE_SIZE * sizeMultiplier,
        left: x * scaleX,
        top: y * scaleY,
        transform: `translate(0%, -30%)`,
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
          src="/assets/npcs/piercing.svg"
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