import { useEffect, useRef } from "react";
import { usePlayer } from "@/contexts/PlayerContext";
import {
  useCharacterProgress,
  getHungerMultiplier,
  MAX_HUNGER,
} from "@/contexts/CharacterProgressContext";
import { useTitles } from "@/contexts/TitleContext";
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
    (statsHp + equipmentHp + titleHp) * allStatsPct * rankMultiplier * hungerMultiplier;
  return 90 + Math.round(effectiveHp) * 10;
}

export function useRegenTimer() {
  const { player } = usePlayer();
  const { progress, setBattleHP } = useCharacterProgress();
  const { getBonus } = useTitles();

  const progressRef = useRef(progress);
  progressRef.current = progress;
  const characterRef = useRef(player.character);
  characterRef.current = player.character;
  const setBattleHPRef = useRef(setBattleHP);
  setBattleHPRef.current = setBattleHP;
  const getBonusRef = useRef(getBonus);
  getBonusRef.current = getBonus;

  useEffect(() => {
    if (player.mode === "battle") return;

    const charProgress = progress[player.character];
    if (!charProgress) return;

    const equipmentBonus = getEquipmentStatsBonus(player.character);
    const titleBonus = getBonus();
    const rankMultiplier = getRankMultiplier(charProgress.level);
    const hungerMultiplier = getHungerMultiplier(charProgress.hunger);
    const maxHp = computeMaxHp(
      charProgress.stats.hp,
      equipmentBonus.hp,
      titleBonus.hp,
      titleBonus.percentAllStats,
      rankMultiplier,
      hungerMultiplier,
    );

    const currentHP = charProgress.battleHP;
    if (currentHP == null || currentHP >= maxHp) return;
    if (charProgress.hunger <= 0) return;

    const healPerTick = (maxHp / 60) * (charProgress.hunger / MAX_HUNGER);

    const interval = setInterval(() => {
      const latest = progressRef.current[characterRef.current];
      if (!latest) return;

      const hp = latest.battleHP;
      if (hp == null || hp >= maxHp) {
        clearInterval(interval);
        return;
      }

      const next = Math.min(maxHp, hp + healPerTick);
      setBattleHPRef.current(
        characterRef.current,
        next >= maxHp ? null : Math.round(next),
      );
    }, REGEN_TICK_MS);

    return () => clearInterval(interval);
  }, [player.mode, player.character, progress, setBattleHP, getBonus]);
}
