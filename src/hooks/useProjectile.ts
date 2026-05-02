import { useEffect } from "react";
import type { Projectile } from "@/utils/types/projectile";
import type { Dispatch, SetStateAction } from "react";

export function useProjectile(
  projectile: Projectile | null,
  setProjectile: Dispatch<SetStateAction<Projectile | null>>,
  onHit: (ignoreRange?: boolean) => void
) {
  useEffect(() => {
    if (!projectile) return;

    const interval = setInterval(() => {
      setProjectile((p) => {
        if (!p) return null;

        const dx = p.targetX - p.x;
        const dy = p.targetY - p.y;

        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 30) {
          onHit(true);
          return null;
        }

        const speed = 6;

        return {
          ...p,
          x: p.x + (dx / dist) * speed,
          y: p.y + (dy / dist) * speed,
        };
      });
    }, 20);

    return () => clearInterval(interval);
  }, [projectile]);
}