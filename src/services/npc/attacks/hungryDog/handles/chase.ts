import { NPC_MELEE_COOLDOWN } from "@/data/cooldowns";
import { chasePlayer } from "@/gameRules/npc/movement";
import { tryMeleeAttack } from "@/gameRules/npc/attack";
import type {
  BehaviorContext,
  BehaviorResult,
} from "@/utils/types/npc/npcBehavior";
import {
  MELEE_RANGE,
  SPECIAL_FIRST_DELAY_MS,
  SPECIAL_MAX,
  SPECIAL_REUSE_COOLDOWN_MS,
  type HungryDogAI,
} from "../state";
import { rechargeSpecial } from "../rechargeSpecial";


export function handleChase(
    ctx: BehaviorContext,
    ai: HungryDogAI,
    now: number,
): BehaviorResult {
    const { npc, targetX, targetY, lastAttackRef, onMeleeHit } = ctx;

    rechargeSpecial(ai, now);

    const { x } = chasePlayer(npc, targetX, targetY, 1, MELEE_RANGE);

    tryMeleeAttack({
        npcX: npc.x,
        npcY: npc.y,
        playerX: targetX,
        playerY: targetY,
        range: MELEE_RANGE,
        cooldown: NPC_MELEE_COOLDOWN,
        lastAttackRef,
        onHit: onMeleeHit,
    });

    if (
    ai.specialGauge >= SPECIAL_MAX &&
    now - ai.introEnd >= SPECIAL_FIRST_DELAY_MS &&
    now - ai.lastSpecialEnd >= SPECIAL_REUSE_COOLDOWN_MS
    ) {
    ai.phase = "dig";
    ai.phaseStart = now;
    ai.specialGauge = 0;
    ai.lastSpecialEnd = now;
    ai.lastRecharge = now;
    }

    return { x, y: npc.y };
}