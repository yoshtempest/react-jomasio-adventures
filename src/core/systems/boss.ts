import { BaseCharacter } from "@/core/characters/base";

export function handleBossPhase(boss: BaseCharacter) {
  if (boss.hp > 0) return boss;

  return {
    ...boss,
    hp: 200, // nova vida fase 2
    behavior: "aggressive",
    damage: boss.damage + 10,
  };
}