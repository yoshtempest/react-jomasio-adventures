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

  // 🔥 FASE 2 → melee
  if (npcPhase === 2) {
    npc.state = "walk";

    const { x, y } = getChaseMovement(
      npc.x,
      npc.y,
      playerX,
      playerY
    );

    if (
      distanceX < 80 &&
      distanceY < 80 &&
      now - lastAttackRef.current > 500
    ) {
      onMeleeHit();
      lastAttackRef.current = now;
    }

    return { x, y };
  }

  // 🟢 FASE 1
  if (npcPhase === 1) {
    const canThrow =
      !projectile &&
      now - lastAttackRef.current > 1500;

    // melee prioridade
    if (distanceX <= 20 && distanceY <= 20) {
      npc.state = "idle";

      if (now - lastAttackRef.current > 800) {
        onMeleeHit();
        lastAttackRef.current = now;
      }

      return { x: npc.x, y: npc.y };
    }

    if (canThrow) {
      npc.state = "idle";

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

    // 🚫 parado enquanto projétil existe
    if (projectile) {
      npc.state = "idle";
      return { x: npc.x, y: npc.y };
    }

    npc.state = "walk";

    const { x, y } = getChaseMovement(
      npc.x,
      npc.y,
      playerX,
      playerY
    );

    return { x, y };
  }
}