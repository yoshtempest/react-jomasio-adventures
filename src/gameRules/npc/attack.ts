import { canAttack, registerAttack, isNear } from "@/gameRules/npc/behavior";
import type { DamageKind } from "@/utils/types/battle/damageKind";

type MeleeAttackParams = {
  npcX: number;
  npcY: number;
  playerX: number;
  playerY: number;
  range: number;
  cooldown: number;
  lastAttackRef: React.RefObject<number>;
  onHit: (multiplier?: number, damageKind?: DamageKind) => void;
  /** Natureza do golpe; o NPC mágico declara aqui em vez de todo melee. */
  damageKind?: DamageKind;
  multiplier?: number;
};

export function tryMeleeAttack({
  npcX,
  npcY,
  playerX,
  playerY,
  range,
  cooldown,
  lastAttackRef,
  onHit,
  damageKind,
  multiplier,
}: MeleeAttackParams) {
  const near = isNear(npcX, npcY, playerX, playerY, range);

  if (!near) return false;

  if (!canAttack(lastAttackRef, cooldown)) {
    return false;
  }

  onHit(multiplier, damageKind);
  registerAttack(lastAttackRef);

  return true;
}
