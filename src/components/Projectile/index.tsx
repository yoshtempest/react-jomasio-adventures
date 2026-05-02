type Props = {
  projectile: { x: number; y: number };
  TILE_SIZE: number;
};

export function ProjectileSprite({ projectile, TILE_SIZE }: Props) {
  const BASE_WIDTH = 1280;
  const BASE_HEIGHT = 600;

  const scaleX = window.innerWidth / BASE_WIDTH;
  const scaleY = window.innerHeight / BASE_HEIGHT;

  return (
    <img
      src="/src/assets/npcs/dish.svg"
      style={{
        position: "absolute",
        left: projectile.x * scaleX,
        top: projectile.y * scaleY,
        width: TILE_SIZE * 0.6, // ✅ agora funciona
        transform: "translate(-50%, -50%)",
        zIndex: 9999,
      }}
    />
  );
}