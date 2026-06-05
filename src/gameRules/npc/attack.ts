import { canAttack, registerAttack, isNear } from "@/gameRules/npc/behavior";

type MeleeAttackParams = {
  npcX: number;
  npcY: number;
  playerX: number;
  playerY: number;
  range: number;
  cooldown: number;
  lastAttackRef: React.RefObject<number>;
  onHit: () => void;
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
}: MeleeAttackParams) {
  const near = isNear(
    npcX,
    npcY,
    playerX,
    playerY,
    range
  );

  if (!near) return false;

  if (!canAttack(lastAttackRef, cooldown)) {
    return false;
  }

  onHit();
  registerAttack(lastAttackRef);

  return true;
}