import type { BattleBehavior } from "@/utils/types/player/playerBehavior";
import { calculatePlayerDamage, calculateSpecialDamage } from "@/gameRules/battle/damage";
import { gainSpecial } from "@/gameRules/battle/special";

export const normalBehavior: BattleBehavior = {
  onBasicHit: ({ setNpcHP, char, playerClass, setDelicia, HITS_TO_SPECIAL }) => {
    const dmg = Math.round(calculatePlayerDamage(char.stats.strength, playerClass));

    setNpcHP((hp: number) => Math.max(0, Math.round(hp) - dmg));
    setDelicia((d: number) => gainSpecial(d, HITS_TO_SPECIAL));
  },

  onSpecialHit: ({ setNpcHP, char, playerClass, setDelicia }) => {
    const dmg = Math.round(calculateSpecialDamage(char.stats.intelligence, playerClass));

    setNpcHP((hp: number) => Math.max(0, Math.round(hp) - dmg));
    setDelicia(0);
  },
};