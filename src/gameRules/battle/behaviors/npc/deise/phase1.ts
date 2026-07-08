import { createCommonProjectile } from "@/gameRules/npc/createDirectionalProjectile";
import type { BehaviorContext } from "@/utils/types/npc/npcBehavior";
import type { DeiseAI } from "./state";
import { CLOSE_RANGE, SUMMON_COOLDOWN, MIN_ACTION_GAP, STAFF_COOLDOWN } from "./state";

type Phase1Result = {
  x: number;
  y: number;
  state?: "walk" | "idle";
};

export function deisePhase1(
  ctx: BehaviorContext,
  ai: DeiseAI,
): Phase1Result {
  const {
    npc, playerX, playerY, targetX, targetY,
    onSummon, projectile, setProjectile,
    setForceIdle,
  } = ctx;

  const now = Date.now();
  const distance = Math.hypot(npc.x - targetX, npc.y - targetY);
  const isPlayerClose = distance <= CLOSE_RANGE;
  const canAct = now - ai.lastAction >= MIN_ACTION_GAP;

  if (isPlayerClose) {
    const summonReady = canAct && now - ai.lastSummon >= SUMMON_COOLDOWN;
    if (summonReady) {
      onSummon?.("rice");
      ai.lastSummon = now;
      ai.lastAction = now;
    }
  } else {
    const staffReady = canAct && !projectile && now - ai.lastStaffThrow >= STAFF_COOLDOWN;
    if (staffReady) {
      setProjectile(createCommonProjectile({
        startX: npc.x - 100,
        startY: npc.y - 80,
        targetX: playerX - 100,
        targetY: playerY - 80,
        sprite: "spoon",
        state: "idle",
      }));

      setForceIdle(true);
      setTimeout(() => setForceIdle(false), 400);

      ai.lastStaffThrow = now;
      ai.lastAction = now;
    }
  }



  return { x: npc.x, y: npc.y };
}
