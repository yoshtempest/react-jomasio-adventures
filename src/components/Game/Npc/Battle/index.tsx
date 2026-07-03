import { asset } from "@/utils/asset";
import {
  getSpritePath,
  getBossSizeMultiplier,
  getNpcSpriteYOffset,
} from "@/utils/npc/getSpritePath";

type Props = {
  x: number;
  y: number;
  TILE_SIZE: number;
  npcType: string;
  state: "idle" | "walk" | "hit" | "jumping" | "attack" | "pitch" | "inAir" | "falling" | "airAttack" | "preAttack" | "preJump" | "inJump" | "jumpAttack" | "block" | "meleeAttack" | "rangedAttack" | "get" | "throw";
  direction: "left" | "right";
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

  const sizeMultiplier = getBossSizeMultiplier(npcType, npcPhase);
  const yOffset = getNpcSpriteYOffset(npcType);

  const basePath = getSpritePath(npcType, state, npcPhase);

  const src = isExploding ? asset("assets/npcs/explosion.svg") : `${basePath}`;

  return (
    <div
      style={{
        position: "absolute",
        width: TILE_SIZE * sizeMultiplier,
        height: TILE_SIZE * sizeMultiplier,
        left: x * scaleX,
        top: y * scaleY,
        transform: `translate(-50%, calc(-100% + ${yOffset * 100}%))`,
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
