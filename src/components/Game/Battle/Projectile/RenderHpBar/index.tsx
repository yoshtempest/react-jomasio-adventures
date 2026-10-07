import HpBar from "../HpBar";

export default function renderHpBar(
  projectile: Projectile,
  x: number,
  y: number,
  scaleX: number,
  scaleY: number,
) {
  if (projectile.indestructible) return null;
  return (
    <HpBar
      x={x}
      y={y}
      scaleX={scaleX}
      scaleY={scaleY}
      hp={projectile.hp}
      maxHp={projectile.maxHp}
    />
  );
}
