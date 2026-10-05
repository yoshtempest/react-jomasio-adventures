import type { BattleBehavior } from "@/utils/types/player/behavior";
import { gainSpecial } from "@/gameRules/battle/special";

export const normalBehavior: BattleBehavior = {
  // Sem `Math.round` no HP: arredondar o HP corrente descartava a fracao
  // deixada pelos golpes anteriores, entao um alvo fraco nunca caia a zero.
  // Quem garante o piso do dano e `atLeastMinDamage`, no fim do funil.
  onBasicHit: ({ damage, setNpcHP, setDelicia, HITS_TO_SPECIAL }) => {
    setNpcHP((hp: number) => Math.max(0, hp - damage));
    setDelicia((d: number) => gainSpecial(d, HITS_TO_SPECIAL));
  },

  onSpecialHit: ({ damage, setNpcHP, setDelicia, hitsToSpecial }) => {
    setNpcHP((hp: number) => Math.max(0, hp - damage));
    setDelicia(() => gainSpecial(0, hitsToSpecial));
  },
};
