import { NPC_MELEE_COOLDOWN } from "@/data/cooldowns";
import type { NpcType } from "@/data/npc/npc";
import { chasePlayer } from "@/gameRules/npc/movement";
import { tryMeleeAttack } from "@/gameRules/npc/attack";
import type {
  BehaviorContext,
  BehaviorResult,
} from "@/utils/types/npc/npcBehavior";

/**
 * Todo NPC ataca. Cada NPC dita COMO ataca em seu próprio arquivo em
 * `services/npc/attacks/<npcType>/` (ou `<npcType>.ts`), estendendo esta
 * classe ou `DefaultNpcAttack`.
 *
 * Um NPC sem ataque registrado quebra a compilação — o registry é um
 * `Record<NpcType, NpcAttack>` — e derruba a batalha em runtime via
 * `getNpcAttack()`.
 */
export abstract class NpcAttack {
  readonly npcType: NpcType;

  constructor(npcType: NpcType) {
    this.npcType = npcType;
  }

  abstract execute(ctx: BehaviorContext): BehaviorResult;
}

/** Ataque padrão: perseguir o player e dar melee quando perto. */
export class DefaultNpcAttack extends NpcAttack {
  execute(ctx: BehaviorContext): BehaviorResult {
    const { npc, targetX, targetY, lastAttackRef, onMeleeHit } = ctx;

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

    return { x, y: npc.y };
  }
}
