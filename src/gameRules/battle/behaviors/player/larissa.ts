import type { BattleBehavior } from "@/utils/types/player/behavior";
import { gainSpecial } from "@/gameRules/battle/special";

export const larissaBehavior: BattleBehavior = {
  onBasicHit: ({
    damage,
    setNpcHP,
    setStacks,
    setDelicia,
    HITS_TO_SPECIAL,
    spawnPiercing,
  }) => {
    setNpcHP((hp: number) => Math.max(0, hp - damage));
    setStacks((s: number) => s + 1);
    setDelicia((d: number) => gainSpecial(d, HITS_TO_SPECIAL));
    spawnPiercing?.();
  },

  onSpecialHit: ({
    damage,
    setNpcHP,
    setStacks,
    setDelicia,
    hitsToSpecial,
    triggerExplosion,
  }) => {
    setNpcHP((hp: number) => Math.max(0, hp - damage));
    triggerExplosion?.();
    setStacks(0);
    setDelicia(() => gainSpecial(0, hitsToSpecial));
  },

  reset: ({ setStacks, setDelicia }) => {
    setStacks(0);
    setDelicia(0);
  },
};
