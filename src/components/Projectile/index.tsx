import { asset } from "@/utils/asset";

type Props = {
  projectile: {
    x: number;
    y: number;
    sprite?: string;
    createdAt: number;
    state: "idle" | "walk";
  };
  TILE_SIZE: number;
};

export function ProjectileSprite({ projectile, TILE_SIZE }: Props) {
  const BASE_WIDTH = 1280;
  const BASE_HEIGHT = 600;

  const scaleX = window.innerWidth / BASE_WIDTH;
  const scaleY = window.innerHeight / BASE_HEIGHT;

  const spriteMap: Record<string, string> = {
    dish: "/assets/npcs/dish.svg",
    "goat-idle": "/assets/npcs/goat/idle.svg",
    "goat-walk": "/assets/npcs/goat/walk.svg",
    staff: "/assets/npcs/staff.svg",
  };

  const spriteKey =
    projectile.sprite === "goat"
      ? projectile.state === "idle"
        ? "goat-idle"
        : "goat-walk"
      : projectile.sprite === "staff"
        ? "staff"
        : "staff";

  const src = spriteMap[spriteKey];

  return (
    <img
      src={asset(src)}
      style={{
        position: "absolute",
        left: projectile.x * scaleX,
        top: projectile.y * scaleY,
        width: TILE_SIZE * 2,
        zIndex: 9999,
        pointerEvents: "none",
      }}
    />
  );
}
