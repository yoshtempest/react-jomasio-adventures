import { NpcAttack } from "../npcAttack";
import { NPC_MELEE_COOLDOWN } from "@/data/cooldowns";
import { chasePlayer } from "@/gameRules/npc/movement";
import { tryMeleeAttack } from "@/gameRules/npc/attack";
import type {
  BehaviorContext,
  BehaviorResult,
} from "@/utils/types/npc/npcBehavior";

const MELEE_RANGE = 40;
const MELEE_VISUAL_DURATION = 300;

/**
 * Sr. Guaxinim: persegue e dá melee como qualquer NPC default, mas troca o
 * sprite para `attack.svg` durante a janela de ataque (`MELEE_VISUAL_DURATION`
 * após o último hit), igual aos demais NPCs com ataque custom.
 */
export class SrGuaxinimAttack extends NpcAttack {
  constructor() {
    super("srGuaxinim");
  }

  execute(ctx: BehaviorContext): BehaviorResult {
    const { npc, targetX, targetY, lastAttackRef, onMeleeHit } = ctx;
    const now = Date.now();

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

    const attacking =
      hit || now - lastAttackRef.current < MELEE_VISUAL_DURATION;

    if (attacking) return { x, y: npc.y, state: "attack" as const };

    return { x, y: npc.y };
  }
}