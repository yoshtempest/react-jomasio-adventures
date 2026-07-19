import { NPC_MELEE_COOLDOWN, JUMP_COOLDOWN } from "@/data/cooldowns";
import { chasePlayer } from "@/gameRules/npc/movement";
import { tryMeleeAttack } from "@/gameRules/npc/attack";
import type { BehaviorContext } from "@/utils/types/npc/npcBehavior";
import type { NPCBattleState } from "@/utils/types/npc/npc";
import type { HungryKingAI } from "./state";
import {
  JUMP_DURATION,
  JUMP_THRESHOLD,
  JUMP_HEIGHT,
  JUMP_RISE_MS,
  JUMP_FLIGHT_MS,
  JUMP_RECOVERY_MS,
} from "./state";
import { BATTLE_SPAWN } from "@/gameRules/battle/spawnPoints";

type Phase1Result = { x: number; y: number; state?: NPCBattleState["state"] };

function getJumpState(elapsed: number): NPCBattleState["state"] {
  if (elapsed < JUMP_RISE_MS) return "jumping";
  if (elapsed < JUMP_RISE_MS + JUMP_FLIGHT_MS) return "inJump";
  return "jumpAttack";
}

export function hungryKingPhase1(
  ctx: BehaviorContext,
  ai: HungryKingAI,
): Phase1Result {
  const { npc, targetX, targetY, lastAttackRef, onMeleeHit } = ctx;
  const now = Date.now();
  const distance = Math.hypot(npc.x - targetX, npc.y - targetY);

  // ── landing recovery ─────────────────────────────
  if (ai.jumpState === "jumpAttack") {
    if (now - ai.landingTime < JUMP_RECOVERY_MS) {
      ai.lastSpriteState = "jumpAttack";
      return { x: npc.x, y: npc.y, state: "jumpAttack" };
    }
    ai.jumpState = "idle";
    ai.lastSpriteState = undefined;
  }

  // ── idle (normal chase + melee + jump start) ─────
  if (ai.jumpState === "idle") {
    const { x } = chasePlayer(npc, targetX, targetY);

    tryMeleeAttack({
      npcX: npc.x,
      npcY: npc.y,
      playerX: targetX,
      playerY: targetY,
      range: 40,
      cooldown: NPC_MELEE_COOLDOWN,
      lastAttackRef,
      onHit: onMeleeHit,
    });

    if (distance > JUMP_THRESHOLD && now - ai.lastJump > JUMP_COOLDOWN) {
      ai.jumpState = "jumping";
      ai.jumpStartTime = now;
      ai.jumpTargetX = targetX;
      ai.lastJump = now;
      npc.jumpLandingX = targetX;
      ai.lastSpriteState = "jumping";
      ctx.playSound?.("hulk");
      return { x, y: npc.y, state: "jumping" };
    }

    ai.lastSpriteState = undefined;
    return { x, y: npc.y };
  }

  // ── in-air (jumping / inJump) ────────────────────
  const elapsed = now - ai.jumpStartTime;

  if (elapsed < JUMP_DURATION) {
    const progress = elapsed / JUMP_DURATION;
    const height = Math.sin(progress * Math.PI) * JUMP_HEIGHT;
    const newX = npc.x + (ai.jumpTargetX - npc.x) * 0.04;
    const spriteState = getJumpState(elapsed);
    if (spriteState === "jumpAttack" && ai.lastSpriteState !== "jumpAttack") {
      ctx.playSound?.("smash");
    }
    ai.lastSpriteState = spriteState;
    return { x: newX, y: BATTLE_SPAWN.npc.y - height, state: spriteState };
  }

  // ── landing ──────────────────────────────────────
  ai.jumpState = "jumpAttack";
  ai.landingTime = now;
  npc.jumpLandingX = undefined;
  ai.lastSpriteState = "jumpAttack";
  ctx.playSound?.("boom");

  if (
    Math.hypot(ai.jumpTargetX - targetX, BATTLE_SPAWN.npc.y - targetY) < 150
  ) {
    onMeleeHit();
  }

  return { x: ai.jumpTargetX, y: BATTLE_SPAWN.npc.y, state: "jumpAttack" };
}
