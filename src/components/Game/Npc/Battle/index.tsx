import { asset } from "@/utils/asset";

type Projectile = {
  x: number;
  y: number;
};

type Props = {
  x: number;
  y: number;
  TILE_SIZE: number;
  npcType: string;
  state: "idle" | "walk" | "hit" | "jumping" | "attack" | "pitch" | "inAir" | "falling" | "airAttack" | "preAttack" | "preJump";
  direction: "left" | "right";
  projectile?: Projectile | null;
  piercings?: { id: number; x: number; y: number }[];
  isExploding?: boolean;
  npcPhase?: number;
  isDying?: boolean;
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
  isDying = false,
}: Props) {
  const BASE_WIDTH = 1280;
  const BASE_HEIGHT = 600;
  const scaleX = window.innerWidth / BASE_WIDTH;
  const scaleY = window.innerHeight / BASE_HEIGHT;

  const bossScales: Record<string, { base: number; phase2: number }> = {
    deise: { base: 1.8, phase2: 3 },
    slimita: { base: 1.6, phase2: 4 },
    hungryKing: { base: 3, phase2: 5 },
  };

  const bossConfig = bossScales[npcType];

  const sizeMultiplier = bossConfig
    ? npcPhase === 2
      ? bossConfig.phase2
      : bossConfig.base
    : 1.4;

  const getSprite = () => {
    if (npcType === "deise") {
      if (npcPhase === 2) {
        return asset(`assets/npcs/deise2/${state}.svg`);
      }
      return asset(`assets/npcs/deise/${state}.svg`);
    }

    if (npcType === "slimita") {
      if (npcPhase === 2) {
        return asset(`assets/npcs/slimita2/${state}.svg`);
      }
      return asset(`assets/npcs/slimita/${state}.svg`);
    }

    return asset(`assets/npcs/${npcType}/${state}.svg`);
  };

  const basePath = getSprite();

  const src = isExploding ? asset("assets/npcs/explosion.svg") : `${basePath}`;

  return (
    <div
      style={{
        position: "absolute",
        width: TILE_SIZE * sizeMultiplier,
        height: TILE_SIZE * sizeMultiplier,
        left: x * scaleX,
        top: y * scaleY,
        transform: `translate(-50%, -100%)`,
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
          opacity: isDying ? 0 : 1,
          filter: isDying ? "grayscale(100%)" : "none",
          transition: "opacity 3s linear, filter 3s linear",
        }}
      />

      {/* 🗡️ PIERCINGS */}
      {piercings.map((p) => (
        <img
          key={p.id}
          src={asset("assets/npcs/piercing.svg")}
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
