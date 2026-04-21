import { BaseCharacter } from "@/core/characters/base";

export function healOrTransform(boss: BaseCharacter) {
  if (boss.hp <= 0) {
    return {
      ...boss,
      hp: 150,
      level: boss.level + 1,
    };
  }

  return boss;
}