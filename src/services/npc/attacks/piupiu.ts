import { NpcAttack } from "../npcAttack";
import { NPC_MELEE_COOLDOWN, STATE_ATTACK_COOLDOWN } from "@/data/cooldowns";
import { chasePlayer } from "@/gameRules/npc/movement";
import { tryMeleeAttack } from "@/gameRules/npc/attack";
import { canAttack } from "@/gameRules/npc/behavior";
import type {
  BehaviorContext,
  BehaviorResult,
} from "@/utils/types/npc/npcBehavior";

const MELEE_RANGE = 40;

export class PiupiuAttack extends NpcAttack {
  constructor() {
    super("piupiu");
  }

  execute(ctx: BehaviorContext): BehaviorResult {
    const { npc, targetX, targetY, lastAttackRef, onMeleeHit } = ctx;

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

    if (!canAttack(lastAttackRef, STATE_ATTACK_COOLDOWN)) {
      return { x: npc.x, y: npc.y, state: "idle" as const };
    }

    return { x, y: npc.y };
  }
}
