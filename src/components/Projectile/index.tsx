import { asset } from "@/utils/asset";
import { spriteMap } from "@/data/battle/projectileSprites";

type Props = {
  projectile: {
    x: number;
    y: number;
    sprite?: string;
    createdAt: number;
    state: "idle" | "walk";
    spear?: {
      phase: "rising" | "falling";
    };
  };
};

export function ProjectileSprite({ projectile }: Props) {
  const BASE_WIDTH = 1280;
  const BASE_HEIGHT = 600;

  const scaleX = window.innerWidth / BASE_WIDTH;
  const scaleY = window.innerHeight / BASE_HEIGHT;

  const spriteKey = projectile.sprite === "goat"
    ? projectile.state === "idle"
      ? "goat-idle"
      : "goat-walk"
    : projectile.sprite && spriteMap[projectile.sprite]
      ? projectile.sprite
      : "staff";

  const src = spriteMap[spriteKey];
  const isFalling = projectile.spear?.phase === "falling";

  return (
    <img
      src={asset(src)}
      style={{
        position: "absolute",
        left: projectile.x * scaleX,
        top: projectile.y * scaleY,
        width: 100,
        transform: isFalling ? "scaleY(-1)" : undefined,
        zIndex: 9999,
        pointerEvents: "none",
      }}
    />
  );
}
