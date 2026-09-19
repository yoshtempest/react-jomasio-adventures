import type {
  BehaviorContext,
  BehaviorResult,
} from "@/utils/types/npc/npcBehavior";
import type { MaugreloAI } from "@/services/npc/attacks/maugrelo/state";
import { PHASE2_VULNERABLE_DURATION } from "@/services/npc/attacks/maugrelo/state";

/**
 * Janela de 3s após o laser em que o Maugrelo fica parado, sem atacar nem
 * se mover, dando brecha para o jogador atacá-lo. Para os papéis o estado
 * é "idle" (renderiza o Maugrelo em pé); ao fim, segue para o debuff.
 */
export function handleVulnerable(
  ai: MaugreloAI,
  ctx: BehaviorContext,
  now: number,
): BehaviorResult {
  const { npc } = ctx;

  if (now - ai.phase2StageStart >= PHASE2_VULNERABLE_DURATION) {
    ai.phase2State = "debuff";
    ai.phase2StageStart = now;
    ai.appliedDebuff = null;
    ctx.playSound?.("writing");
    ctx.playSound?.("stupid");
    return { x: npc.x, y: ai.riseStartY, state: "debuff" };
  }

  return { x: npc.x, y: ai.riseStartY, state: "idle" };
}