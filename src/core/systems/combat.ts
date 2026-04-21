import { BaseCharacter } from "@/core/characters/base";

export function attack(
  attacker: BaseCharacter,
  target: BaseCharacter,
  currentTime: number
) {
  if (currentTime < attacker.cooldown) {
    return { attacker, target, success: false };
  }

  const newTarget = {
    ...target,
    hp: Math.max(0, target.hp - attacker.damage),
  };

  const newAttacker = {
    ...attacker,
    cooldown: currentTime + 500, // meio segundo
  };

  return {
    attacker: newAttacker,
    target: newTarget,
    success: true,
  };
}