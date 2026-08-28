import { ProjectileSprite } from "@/components/Game/Battle/Projectile";

type Props = {
  projectile: Projectile | null;
  groundY: number;
};

export function NpcProjectile({ projectile, groundY }: Props) {
  if (!projectile) return null;

  return <ProjectileSprite projectile={projectile} groundY={groundY} />;
}
