import { NpcAttack } from "../npcAttack";
import { NPC_MELEE_COOLDOWN } from "@/data/cooldowns";
import { tryMeleeAttack } from "@/gameRules/npc/attack";
import type {
  BehaviorContext,
  BehaviorResult,
} from "@/utils/types/npc/npcBehavior";

export class DummyAttack extends NpcAttack {
  constructor() {
    super("dummy");
  }

  execute(ctx: BehaviorContext): BehaviorResult {
    const { npc, targetX, targetY, lastAttackRef, onMeleeHit } = ctx;

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

    return { x: npc.x, y: npc.y, state: "idle" as const };
  }
}
