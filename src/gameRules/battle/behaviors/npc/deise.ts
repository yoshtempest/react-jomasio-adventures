import { getChaseMovement } from "@/gameRules/movement/npc";
import type { BehaviorContext } from "@/utils/types/npc/npcBehavior";

export function deiseBehavior(ctx: BehaviorContext) {
  const {
    npc,
    playerX,
    playerY,
    projectile,
    setProjectile,
    lastAttackRef,
    setForceIdle,
    npcPhase,
    onMeleeHit,
  } = ctx;

  const distanceX = Math.abs(npc.x - playerX);
  const distanceY = Math.abs(npc.y - playerY);
  const now = Date.now();

  // 🔥 FASE 2 → vira melee (igual normal)
  if (npcPhase === 2) {
    const newX = getChaseMovement(npc.x, playerX, distanceX);

    if (
      distanceX < 80 &&
      distanceY < 80 &&
      now - lastAttackRef.current > 800
    ) {
      onMeleeHit();
      lastAttackRef.current = now;
    }

    return { x: newX };
  }

  if (npcPhase === 1) {
    const canThrow =
      !projectile &&
      now - lastAttackRef.current > 1000;

      // 🔥 PRIORIDADE: melee se estiver perto
      if (distanceX <= 30 && distanceY <= 30) {
        if (now - lastAttackRef.current > 800) {
          onMeleeHit();
          lastAttackRef.current = now;
        }

        return { x: npc.x };
      }

    if (canThrow) {
      setProjectile({
        x: npc.x,
        y: npc.y + 50,
        targetX: playerX,
        targetY: playerY + 10,
        sprite: "goat",
        createdAt: Date.now(),
        state: "walk",
      });

      lastAttackRef.current = now;

      setForceIdle(true);
      setTimeout(() => setForceIdle(false), 1000);
    }

    if (projectile) {
      return { x: npc.x };
    }

    const newX = getChaseMovement(npc.x, playerX, distanceX);

    return { x: newX };
  }
}