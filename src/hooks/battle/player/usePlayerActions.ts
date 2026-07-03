import { useCallback } from "react";

import { PLAYER_BASIC_COOLDOWN } from "@/data/cooldowns";
import {
  calculatePlayerDamage,
  getBerserkMultiplier,
} from "@/gameRules/battle/damage";
import { playAttackSound } from "@/utils/types/battle/playAttackSound";
import { useBuildTargetList } from "./usePlayerTargeting";
import {
  incrementAttacksUsedStats,
  incrementHitsUsedStats,
} from "@/utils/rewards/battleStats";

import type { SummonedNpc } from "@/utils/types/npc/npc";
import type { CharactersProgress } from "@/data/characters/defaultProgress";


type Props = {
  player: Player;
  npc: {
    x: number;
    y: number;
  };
  summons: SummonedNpc[];
  npcHP: number;
  playerClass: PlayerClass;
  progress: CharactersProgress;
  npcLevel: number;
  battle: {
    playerCooldown: React.RefObject<boolean>;
    isEnding: React.RefObject<boolean>;
    playerHit: () => void;
    specialHit: () => void;
    setDelicia: React.Dispatch<React.SetStateAction<number>>;
    hitsToSpecial: number;
  };

  setSummons: React.Dispatch<React.SetStateAction<SummonedNpc[]>>;

  giveSummonRewards: (npcClass: NPCClass) => void;

  spawnDamageRef: React.RefObject<
    (value: number, x: number, y: number, type: DamageType) => void
  >;
  registerHitRef: React.RefObject<(damage: number) => void>;

  setPlayerHP: React.Dispatch<React.SetStateAction<number>>;
  playerHP: number;
  playerMaxHp: number;
  totalVampirism: number;
};

export function usePlayerBattleActions({
  player,
  npc,
  summons,
  npcHP,
  playerClass,
  progress,
  battle,
  setSummons,
  giveSummonRewards,
  spawnDamageRef,
  registerHitRef,
  setPlayerHP,
  playerHP,
  playerMaxHp,
  totalVampirism,
}: Props) {
  const { getTargets, isInAttackRange } = useBuildTargetList(
    player,
    npc,
    npcHP,
    summons,
  );

  const handlePlayerHit = useCallback(() => {
    if (!battle.playerCooldown.current || battle.isEnding.current) {
      return;
    }

    const targets = getTargets();
    const mainTarget = targets.find((t) => t.id === "main");

    // Priority 1: hit main NPC (boss) if in range
    if (mainTarget && isInAttackRange(mainTarget)) {
      battle.playerHit();
      return;
    }

    // Priority 2: hit the closest summon in range (only one per attack)
    for (const target of targets) {
      if (target.id === "main") continue;
      if (!isInAttackRange(target)) continue;

      const targetSummon = summons.find((summon) => summon.id === target.id);
      if (!targetSummon) continue;

      playAttackSound(player.character);

      const char = progress[player.character];
      const raw = calculatePlayerDamage(char.stats.strength, playerClass);
      const damage = Math.round(
        player.character === "samuel" && char.level >= 20
          ? raw * getBerserkMultiplier(playerHP, playerMaxHp)
          : raw,
      );

      spawnDamageRef.current?.(damage, target.x, target.y, "summon");
      registerHitRef.current?.(damage);
      battle.setDelicia((d) => Math.min(d + 1, battle.hitsToSpecial));
      incrementAttacksUsedStats(player.character);
      incrementHitsUsedStats(player.character);

      if (totalVampirism > 0) {
        const heal = Math.round((damage * totalVampirism) / 100);
        if (heal > 0) setPlayerHP((hp) => Math.min(playerMaxHp, hp + heal));
      }

      const newHp = Math.max(0, Math.round(targetSummon.hp) - damage);

      if (newHp <= 0) {
        giveSummonRewards("rare");
      }

      setSummons((prev) =>
        prev.map((summon) =>
          summon.id === target.id ? { ...summon, hp: newHp } : summon,
        ),
      );

      battle.playerCooldown.current = false;
      setTimeout(() => {
        battle.playerCooldown.current = true;
      }, PLAYER_BASIC_COOLDOWN);

      return;
    }
  }, [
    player, summons, progress, playerClass, battle,
    setSummons, giveSummonRewards, spawnDamageRef, registerHitRef,
    playerHP, setPlayerHP, playerMaxHp, totalVampirism,
    getTargets, isInAttackRange,
  ]);

  const handleSpecialHit = useCallback(() => {
    if (!battle.playerCooldown.current || battle.isEnding.current) {
      return;
    }

    const targets = getTargets();

    for (const target of targets) {
      if (target.id === "main") {
        battle.specialHit();
        return;
      }
    }
  }, [battle, getTargets]);

  return {
    handlePlayerHit,
    handleSpecialHit,
  };
}
