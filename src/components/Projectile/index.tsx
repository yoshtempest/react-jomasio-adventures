type Props = {
  projectile: { x: number; y: number; sprite?: string; };
  TILE_SIZE: number;
};

export function ProjectileSprite({ projectile, TILE_SIZE }: Props) {
  const BASE_WIDTH = 1280;
  const BASE_HEIGHT = 600;

  const scaleX = window.innerWidth / BASE_WIDTH;
  const scaleY = window.innerHeight / BASE_HEIGHT;

  const spriteMap: Record<string, string> = {
    dish: "/src/assets/npcs/dish.svg",
    goat: "/src/assets/npcs/goat/walk.svg",
  };

  const src = spriteMap[projectile.sprite || "dish"];

  return (
    <img
      src={src}
      style={{
        position: "absolute",
        left: projectile.x * scaleX,
        top: projectile.y * scaleY,
        width: TILE_SIZE * 2, // ✅ agora funciona
        transform: "translate(-50%, -50%)",
        zIndex: 9999,
      }}
    />
  );
}