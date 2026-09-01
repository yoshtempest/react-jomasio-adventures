import { NpcAttack } from "../../npcAttack";
import { NPC_MELEE_COOLDOWN } from "@/data/cooldowns";
import { chasePlayer } from "@/gameRules/npc/movement";
import { tryMeleeAttack } from "@/gameRules/npc/attack";
import type {
  BehaviorContext,
  BehaviorResult,
} from "@/utils/types/npc/npcBehavior";
import type { NPCBattleState } from "@/utils/types/npc/npc";
import { BATTLE_SPAWN } from "@/gameRules/battle/spawnPoints";

const MELEE_RANGE = 40;
const JUMP_COOLDOWN = 3000;
const JUMP_DURATION = 1200;
const JUMP_THRESHOLD = 200;
const JUMP_HEIGHT = 40;
const JUMP_RISE_MS = 400;
const JUMP_FLIGHT_MS = 600;
const JUMP_RECOVERY_MS = 500;
const MELEE_ATTACK_DURATION = 400;

function getJumpState(elapsed: number): NPCBattleState["state"] {
  if (elapsed < JUMP_RISE_MS) return "jumping";
  if (elapsed < JUMP_RISE_MS + JUMP_FLIGHT_MS) return "inJump";
  return "jumpAttack";
}

export class GoatAttack extends NpcAttack {
  constructor() {
    super("goat");
  }

  execute(ctx: BehaviorContext): BehaviorResult {
    const { npc, targetX, targetY, lastAttackRef, onMeleeHit } = ctx;
    const now = Date.now();
    const distance = Math.hypot(npc.x - targetX, npc.y - targetY);

    if (!npc.ai) npc.ai = {};
    if (!npc.ai.goat) {
      npc.ai.goat = {
        jumpState: "idle",
        jumpStartTime: now,
        jumpTargetX: 0,
        lastJump: 0,
        landingTime: now,
        lastMeleeAttack: 0,
      };
    }

    const ai = npc.ai.goat;

    if (ai.jumpState === "jumpAttack") {
      if (now - ai.landingTime < JUMP_RECOVERY_MS) {
        return { x: npc.x, y: npc.y, state: "jumpAttack" };
      }
      ai.jumpState = "idle";
    }

    if (ai.jumpState === "idle") {
      const { x } = chasePlayer(npc, targetX, targetY, 1, MELEE_RANGE);

      const hit = tryMeleeAttack({
        npcX: npc.x,
        npcY: npc.y,
        playerX: targetX,
        playerY: targetY,
        range: MELEE_RANGE,
        cooldown: NPC_MELEE_COOLDOWN,
        lastAttackRef,
        onHit: onMeleeHit,
      });

      if (hit) {
        ai.lastMeleeAttack = now;
        return { x: npc.x, y: npc.y, state: "meleeAttack" };
      }

      if (now - ai.lastMeleeAttack < MELEE_ATTACK_DURATION) {
        return { x: npc.x, y: npc.y, state: "meleeAttack" };
      }

      if (distance > JUMP_THRESHOLD && now - ai.lastJump > JUMP_COOLDOWN) {
        ai.jumpState = "jumping";
        ai.jumpStartTime = now;
        ai.jumpTargetX = targetX;
        ai.lastJump = now;
        npc.jumpLandingX = targetX;
        ctx.playSound?.("goatJump");
        return { x, y: npc.y, state: "jumping" };
      }

      return { x, y: npc.y };
    }

    const elapsed = now - ai.jumpStartTime;

    if (elapsed < JUMP_DURATION) {
      const progress = elapsed / JUMP_DURATION;
      const height = Math.sin(progress * Math.PI) * JUMP_HEIGHT;
      const newX = npc.x + (ai.jumpTargetX - npc.x) * 0.07;
      const spriteState = getJumpState(elapsed);

      ai.lastSpriteState = spriteState;
      return { x: newX, y: BATTLE_SPAWN.npc.y - height, state: spriteState };
    }

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
}
