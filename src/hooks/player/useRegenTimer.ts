import { useEffect } from "react";
import { usePlayer } from "@/contexts/PlayerContext";
import {
  useCharacterProgress,
  getHungerMultiplier,
  MAX_HUNGER,
} from "@/contexts/CharacterProgressContext";
import { useTitles } from "@/contexts/TitleContext";
import { useLatestRef } from "@/hooks/useLatestRef";
import { getEquipmentStatsBonus } from "@/gameRules/battle/equipment";
import { getRankMultiplier } from "@/gameRules/rank";

const REGEN_TICK_MS = 1000;

function computeMaxHp(
  statsHp: number,
  equipmentHp: number,
  titleHp: number,
  titleAllStatsPct: number,
  rankMultiplier: number,
  hungerMultiplier: number,
): number {
  const allStatsPct = 1 + titleAllStatsPct / 100;
  const effectiveHp =
    (statsHp + equipmentHp + titleHp) *
    allStatsPct *
    rankMultiplier *
    hungerMultiplier;
  return 90 + Math.round(effectiveHp) * 10;
}

/**
 * Regenera o HP fora de batalha, um tick por segundo.
 *
 * O intervalo depende só de modo e personagem. `progress` ficou de fora
 * das dependências porque cada tick escreve `battleHP` — tê-lo ali fazia
 * o effect destruir e recriar o próprio intervalo a cada segundo. HP
 * atual, fome e teto de vida são relidos por ref dentro do tick, então o
 * cálculo continua acompanhando mudança de equipamento, título e fome
 * sem precisar reinstalar nada.
 */
export function useRegenTimer() {
  const { player } = usePlayer();
  const { progress, setBattleHP } = useCharacterProgress();
  const { getBonus } = useTitles();

  const progressRef = useLatestRef(progress);
  const characterRef = useLatestRef(player.character);
  const setBattleHPRef = useLatestRef(setBattleHP);
  const getBonusRef = useLatestRef(getBonus);

  useEffect(() => {
    if (player.mode === "battle") return;

    const interval = setInterval(() => {
      const character = characterRef.current;
      const charProgress = progressRef.current[character];
      if (!charProgress) return;

      const hp = charProgress.battleHP;
      if (hp == null) return;
      if (charProgress.hunger <= 0) return;

      const titleBonus = getBonusRef.current();
      const maxHp = computeMaxHp(
        charProgress.stats.hp,
        getEquipmentStatsBonus(character).hp,
        titleBonus.hp,
        titleBonus.percentAllStats,
        getRankMultiplier(charProgress.level),
        getHungerMultiplier(charProgress.hunger),
      );

      if (hp >= maxHp) return;

      const healPerTick = (maxHp / 60) * (charProgress.hunger / MAX_HUNGER);
      const next = Math.min(maxHp, hp + healPerTick);

      setBattleHPRef.current(character, next >= maxHp ? null : Math.round(next));
    }, REGEN_TICK_MS);

    return () => clearInterval(interval);
  }, [
    player.mode,
    characterRef,
    progressRef,
    setBattleHPRef,
    getBonusRef,
  ]);
}
