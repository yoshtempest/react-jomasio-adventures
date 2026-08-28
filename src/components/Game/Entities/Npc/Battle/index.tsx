import { useEffect, useRef } from "react";
import { npcPathProjectile } from "@/utils/paths";
import {
  getSpritePath,
  getBossSizeMultiplier,
  getNpcSpriteYOffset,
} from "@/utils/npc/getSpritePath";
import { ProjectileConstants } from "@/data/projectile";
import { useSoundEffects } from "@/contexts/SoundEffectsContext";

type Props = {
  x: number;
  y: number;
  TILE_SIZE: number;
  npcType: string;
  state:
    | "idle"
    | "walk"
    | "default"
    | "hit"
    | "jumping"
    | "attack"
    | "pitch"
    | "inAir"
    | "falling"
    | "airAttack"
    | "preAttack"
    | "preJump"
    | "inJump"
    | "jumpAttack"
    | "block"
    | "meleeAttack"
    | "rangedAttack"
    | "get"
    | "throw"
    | "startDash"
    | "inDash"
    | "startThrow"
    | "throwing"
    | "throwed"
    | "startSpin"
    | "inSpin"
    | "finishSpin"
    | "preMove"
    | "run"
    | "slap"
    | "push"
    | "meditating";
  direction: "left" | "right";
  piercings?: { id: number; x: number; y: number }[];
  isExploding?: boolean;
  isHidden?: boolean;
  npcPhase?: number;
  isDying?: boolean;
  isAlfa?: boolean;
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
  isHidden = false,
  npcPhase = 1,
  isDying = false,
  isAlfa = false,
}: Props) {
  const { playSound } = useSoundEffects();
  const prevIsExplodingRef = useRef(isExploding);

  useEffect(() => {
    // Troca para o sprite explosion.svg -> explosion.mp3 (uma vez por transição)
    if (isExploding && !prevIsExplodingRef.current) {
      playSound("explosion");
    }
    prevIsExplodingRef.current = isExploding;
  }, [isExploding, playSound]);

  const scaleX = window.innerWidth / ProjectileConstants.MAP_WIDTH;
  const scaleY = window.innerHeight / ProjectileConstants.MAP_HEIGHT;

  const sizeMultiplier = getBossSizeMultiplier(npcType, npcPhase, isAlfa);
  const yOffset = getNpcSpriteYOffset(npcType);

  const basePath = getSpritePath(npcType, state, npcPhase);

  const src = isExploding ? npcPathProjectile("/explosion.svg") : `${basePath}`;

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
      {/* 🧍 NPC (oculto quando vira alvo de bomba da killerQueen) */}
      {!isHidden && (
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
      )}

      {/* 🗡️ PIERCINGS */}
      {piercings.map((p) => (
        <img
          key={p.id}
          src={npcPathProjectile("/piercing.svg")}
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
