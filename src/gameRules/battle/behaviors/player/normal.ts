import type { BattleBehavior } from "@/utils/types/player/behavior";
import { gainSpecial } from "@/gameRules/battle/special";

export const normalBehavior: BattleBehavior = {
  onBasicHit: ({ damage, setNpcHP, setDelicia, HITS_TO_SPECIAL }) => {
    setNpcHP((hp: number) => Math.max(0, Math.round(hp) - damage));
    setDelicia((d: number) => gainSpecial(d, HITS_TO_SPECIAL));
  },

  onSpecialHit: ({ damage, setNpcHP, setDelicia, hitsToSpecial }) => {
    setNpcHP((hp: number) => Math.max(0, Math.round(hp) - damage));
    setDelicia(() => gainSpecial(0, hitsToSpecial));
  },
};
