import { chasePlayer } from "@/gameRules/npc/movement";
import { tryMeleeAttack } from "@/gameRules/npc/attack";
import type { BehaviorContext } from "@/utils/types/npc/npcBehavior";
import type { DeiseAI } from "./state";

type Phase2Result = {
  x: number;
  y: number;
  state?: "pitch" | "walk" | "idle";
};

export function deisePhase2(
  ctx: BehaviorContext,
  ai: DeiseAI,
): Phase2Result {
  const {
    npc, playerX, playerY,
    projectile, setProjectile,
    lastAttackRef, onMeleeHit,
  } = ctx;

  const now = Date.now();
  const isInPitch = now < ai.phase2PitchEnd;

  if (isInPitch) {
    return { x: npc.x, y: npc.y, state: "pitch" };
  }

  if (!projectile) {
    setProjectile({
      x: npc.x - 40,
      y: npc.y + 100,
      startX: npc.x - 40,
      startY: npc.y + 600,
      dirX: 0,
      dirY: -1,
      sprite: "spear",
      createdAt: now,
      state: "idle",
      fallTargetX: playerX,
      spear: { phase: "rising" },
    });

    ai.lastStaffThrow = now;
    ai.lastAction = now;
    ai.phase2OpeningDone = true;
    ai.phase2PitchEnd = now + 200;
    return { x: npc.x, y: npc.y, state: "pitch" };
  }

  // Spear is in flight — chase player and attempt melee
  const { x } = chasePlayer(npc, playerX, playerY);

  tryMeleeAttack({
    npcX: npc.x,
    npcY: npc.y,
    playerX,
    playerY,
    range: 200,
    cooldown: 2000,
    lastAttackRef,
    onHit: onMeleeHit,
  });

  return { x, y: npc.y, state: "walk" };
}
