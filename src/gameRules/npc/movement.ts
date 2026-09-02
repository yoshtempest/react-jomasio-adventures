import { getChaseMovement } from "@/gameRules/movement/npc";
import { BATTLE_LIMITS } from "@/gameRules/movement/constants";
import type { NPCBattleState } from "@/utils/types/npc/npc";

export function chasePlayer(
  npc: NPCBattleState,
  playerX: number,
  playerY: number,
  speedMultiplier: number = 1,
  stopDistance: number = 10,
) {
  return getChaseMovement(
    npc.x,
    npc.y,
    playerX,
    playerY,
    speedMultiplier,
    stopDistance,
  );
}

/**
 * X para onde um NPC deve teleportar para aparecer atrás do jogador.
 *
 * "Atrás" é o lado oposto ao que o jogador está virado, recuado `offset` px,
 * sempre dentro dos limites da arena — teleportar para fora deles deixaria o
 * NPC inalcançável.
 */
export function getBehindPlayerX(
  playerX: number,
  playerDirection: Direction,
  offset: number,
): number {
  const behindX =
    playerDirection === "right" ? playerX - offset : playerX + offset;
  return Math.max(BATTLE_LIMITS.minX, Math.min(BATTLE_LIMITS.maxX, behindX));
}
