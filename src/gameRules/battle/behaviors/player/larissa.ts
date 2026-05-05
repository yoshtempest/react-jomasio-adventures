import type { BattleBehavior } from "@/utils/types/player/playerBehavior";
import { gainSpecial } from "@/gameRules/battle/special";

export const larissaBehavior: BattleBehavior = {
  onBasicHit: ({
    setNpcHP,
    setStacks,
    setDelicia,
    HITS_TO_SPECIAL,
    spawnPiercing,
  }) => {
    // 🔹 dano fixo
    setNpcHP((hp: number) => Math.max(0, hp - 2));

    // 🔹 acumula stacks
    setStacks((s: number) => s + 1);

    // 🔹 carrega especial
    setDelicia((d: number) => gainSpecial(d, HITS_TO_SPECIAL));

    spawnPiercing?.();
  },

  onSpecialHit: ({
    stacks,
    setNpcHP,
    setStacks,
    setDelicia,
    triggerExplosion,
  }) => {
    const dmg = stacks * 5;

    setNpcHP((hp: number) => Math.max(0, hp - dmg));
    triggerExplosion?.();

    // 🔥 reset total
    setStacks(0);
    setDelicia(0);
  },

  reset: ({ setStacks, setDelicia }) => {
    setStacks(0);
    setDelicia(0);
  }
};