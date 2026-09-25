import type { SpawnDamageFn } from "@/utils/types/battle/spawnDamageFn";

/**
 * Tempo desde a entrada de parry mais recente.
 *
 * Bloquear e atacar valem igual: as duas entradas abrem a janela, então o
 * jogador pode dar o parry defendendo no timing ou atacando junto com o
 * golpe do NPC.
 */

export function applyGuardBreak(
  remainingDmg: number,
  damagePlayerHp: (damage: number) => void,
  setPlayer: React.Dispatch<React.SetStateAction<Player>>,
  spawnDamageRef: React.RefObject<SpawnDamageFn>,
  playerX: number,
  playerY: number,
) {
  damagePlayerHp(remainingDmg);
  setPlayer((p) => ({ ...p, state: "stun" }));
  spawnDamageRef.current?.(remainingDmg, playerX, playerY, "npc");
}