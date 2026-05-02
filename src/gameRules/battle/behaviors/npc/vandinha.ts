import { getChaseMovement } from "@/gameRules/movement/npc";
import type { BehaviorContext } from "./types";

export function vandinhaBehavior(ctx: BehaviorContext) {
  const {
    npc,
    playerX,
    playerY,
    projectile,
    setProjectile,
    lastAttackRef,
    setForceIdle,
  } = ctx;

  const distanceX = Math.abs(npc.x - playerX);
  const now = Date.now();

  const canThrow =
    !projectile &&
    now - lastAttackRef.current > 3000;

  if (canThrow) {
    setProjectile({
      x: npc.x,
      y: npc.y,
      targetX: playerX,
      targetY: playerY,
    });

    lastAttackRef.current = now;

    setForceIdle(true);
    setTimeout(() => setForceIdle(false), 2000);
  }

  // 🚫 não anda com projétil
  if (projectile) {
    return { x: npc.x };
  }
  
  const newX = getChaseMovement(npc.x, playerX, distanceX);

  return { x: newX };
}