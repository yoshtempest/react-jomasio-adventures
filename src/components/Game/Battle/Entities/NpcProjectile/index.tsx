import { ProjectileSprite } from "@/components/Game/Battle/Projectile";

type Props = {
  projectiles: Projectile[];
  groundY: number;
};

export function NpcProjectile({ projectiles, groundY }: Props) {
  if (projectiles.length === 0) return null;

  return (
    <>
      {projectiles.map((p) => (
        <ProjectileSprite key={p.createdAt} projectile={p} groundY={groundY} />
      ))}
    </>
  );
}
