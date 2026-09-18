import { BATTLE_LIMITS } from "@/gameRules/movement/constants";
import { chasePlayer } from "@/gameRules/npc/movement";
import { isNear } from "@/gameRules/npc/behavior";
import type { BehaviorContext } from "@/utils/types/npc/npcBehavior";
import type { DeiseAI } from "./state";
import {
  DASH_CONTACT_RANGE,
  DASH_COOLDOWN,
  DASH_DAMAGE_INTERVAL_MS,
  DASH_DURATION_MS,
  DASH_POST_IDLE_MS,
  DASH_PUSH_GAP,
  DASH_WIND_UP_MS,
} from "./state";

type Phase2Result = {
  x: number;
  y: number;
  state?: "idle" | "walk";
};

function dashDirectionTo(playerX: number, npcX: number): "left" | "right" {
  return playerX >= npcX ? "right" : "left";
}

function dashToEnd(direction: "left" | "right"): number {
  return direction === "right" ? BATTLE_LIMITS.maxX : BATTLE_LIMITS.minX;
}

/**
 * Fase 2 da Deise: em vez de arremessar lanças, ela arranca em direção ao
 * jogador (dash) e atravessa a arena até a ponta oposta ao longo de
 * `DASH_DURATION_MS` (6s), usando a sprite `walk`. Enquanto corre surge uma
 * instância do efeito `four.svg` sobre ela, no lado para o qual está virada
 * (ver `DeiseDashAfterimage`). Em contato com o jogador ela causa dano a cada
 * `DASH_DAMAGE_INTERVAL_MS` e empurra/arrasta o jogador na frente dela pelo
 * caminho. A única forma de evitar o arrasto é dar parry (block/attack 0-50ms
 * antes do contato), que estanca a Deise e interrompe o dash. Ao chegar na
 * outra ponta ela fica `DASH_POST_IDLE_MS` (3s) parada sem atacar, dando ao
 * jogador uma janela para causar dano.
 */
export function deisePhase2(ctx: BehaviorContext, ai: DeiseAI): Phase2Result {
  const {
    npc,
    targetX,
    targetY,
    playerX,
    playerY,
    onMeleeHit,
    isPlayerParrying,
    onRamPushPlayer,
    playSound,
  } = ctx;

  const now = Date.now();

  // ── windUp: arrancada anunciada antes de correr ──
  if (ai.dashState === "windUp") {
    if (now - ai.dashStart >= DASH_WIND_UP_MS) {
      ai.dashState = "dashing";
      ai.dashStart = now;
      ai.dashStartX = npc.x;
      ai.dashDirection = dashDirectionTo(targetX, npc.x);
      ai.dashEndX = dashToEnd(ai.dashDirection);
      ai.lastDashDamage = now;
      playSound?.("whooshWind");
    }
    return { x: npc.x, y: npc.y, state: "idle" };
  }

  // ── dashing: cruza a arena em DASH_DURATION_MS até a ponta oposta ──
  if (ai.dashState === "dashing") {
    const progress = Math.min((now - ai.dashStart) / DASH_DURATION_MS, 1);
    const newX = ai.dashStartX + (ai.dashEndX - ai.dashStartX) * progress;

    if (isNear(newX, npc.y, playerX, playerY, DASH_CONTACT_RANGE)) {
      // Parry abre caminho: sem parry a Deise arrasta o jogador à frente dela.
      const parrying = isPlayerParrying?.() ?? false;

      if (now - ai.lastDashDamage >= DASH_DAMAGE_INTERVAL_MS) {
        ai.lastDashDamage = now;
        playSound?.("impact", false);
        onMeleeHit();
      }

      if (!parrying) {
        const gap = ai.dashDirection === "right" ? DASH_PUSH_GAP : -DASH_PUSH_GAP;
        const pushX = Math.max(
          BATTLE_LIMITS.minX,
          Math.min(BATTLE_LIMITS.maxX, newX + gap),
        );
        onRamPushPlayer?.(ai.dashDirection, pushX);
      }
    }

    if (progress >= 1) {
      ai.dashState = "postDash";
      ai.postDashStart = now;
      ai.lastDash = now;
      return { x: newX, y: npc.y, state: "idle" };
    }

    return { x: newX, y: npc.y, state: "walk" };
  }

  // ── postDash: ociosa depois de chegar na outra ponta ──
  if (ai.dashState === "postDash") {
    if (now - ai.postDashStart >= DASH_POST_IDLE_MS) {
      ai.dashState = "idle";
    }
    return { x: npc.x, y: npc.y, state: "idle" };
  }

  // ── idle: aguarda o cooldown e arranca de novo ──
  const dashReady = now - ai.lastDash >= DASH_COOLDOWN;
  if (dashReady) {
    ai.dashState = "windUp";
    ai.dashStart = now;
    return { x: npc.x, y: npc.y, state: "idle" };
  }

  const { x } = chasePlayer(npc, targetX, targetY, 1, 120);
  return { x, y: npc.y, state: "walk" };
}