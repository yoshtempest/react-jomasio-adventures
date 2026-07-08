import { useCallback, useRef, useEffect } from "react";

import { PLAYER_BASIC_COOLDOWN } from "@/data/cooldowns";
import {
  calculatePlayerDamage,
  getBerserkMultiplier,
} from "@/gameRules/battle/damage";
import { playAttackSound } from "@/utils/types/battle/playAttackSound";
import { isPlayerInRange } from "@/gameRules/battle/range";
import { isFacingTarget } from "@/gameRules/battle/direction";
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
    playerHit: (multiplier?: number, bypassCanPlayerHit?: boolean) => void;
    specialHit: (multiplier?: number, bypassRangeCheck?: boolean) => void;
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
  onNpcPush?: (targetX: number) => void;
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
  onNpcPush,
}: Props) {
  const fallingAttackUsedRef = useRef(false);

  useEffect(() => {
    if (player.y === player.groundY) {
      fallingAttackUsedRef.current = false;
    }
  }, [player.y, player.groundY]);

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

    if (player.state === "blocked") {
      const areaTargets = targets.filter((target) =>
        isPlayerInRange(
          player.x, player.y, target.x, target.y,
          player.state, player.character, false, true,
        ) && isFacingTarget(
          player.x, player.y, target.x, target.y,
          player.battleDirection,
        ),
      );

      if (areaTargets.length === 0) return;

      let hitMain = false;

      for (const target of areaTargets) {
        if (target.id === "main") {
          hitMain = true;
          const pushDir = player.battleDirection === "right" ? 1 : -1;
          onNpcPush?.(npc.x + pushDir * 20);
          battle.playerHit(0.7, true);
          continue;
        }

        const targetSummon = summons.find((summon) => summon.id === target.id);
        if (!targetSummon) continue;

        const char = progress[player.character];
        const raw = calculatePlayerDamage(char.stats.strength, playerClass);
        const baseDmg = Math.round(
          player.character === "samuel" && char.level >= 20
            ? raw * getBerserkMultiplier(playerHP, playerMaxHp)
            : raw,
        );
        const dmg = Math.round(baseDmg * 0.7);

        spawnDamageRef.current?.(dmg, target.x, target.y, "summon");
        registerHitRef.current?.(dmg);
        battle.setDelicia((d) => Math.min(d + 1, battle.hitsToSpecial));
        incrementAttacksUsedStats(player.character);
        incrementHitsUsedStats(player.character);

        if (totalVampirism > 0) {
          const heal = Math.round((dmg * totalVampirism) / 100);
          if (heal > 0) setPlayerHP((hp) => Math.min(playerMaxHp, hp + heal));
        }

        const newHp = Math.max(0, Math.round(targetSummon.hp) - dmg);
        if (newHp <= 0) giveSummonRewards("rare");

        setSummons((prev) =>
          prev.map((summon) =>
            summon.id === target.id ? { ...summon, hp: newHp } : summon,
          ),
        );
      }

      if (!hitMain) {
        playAttackSound(player.character);
        battle.playerCooldown.current = false;
        setTimeout(() => {
          battle.playerCooldown.current = true;
        }, PLAYER_BASIC_COOLDOWN);
      }

      return;
    }

    // Priority 1: hit main NPC (boss) if in range
    if (mainTarget && isInAttackRange(mainTarget)) {
      if (player.state === "falling" && !fallingAttackUsedRef.current) {
        fallingAttackUsedRef.current = true;
        battle.playerHit(1.2);
      } else {
        battle.playerHit();
      }
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
    npc.x, onNpcPush,
  ]);

  const handleSpecialHit = useCallback(() => {
    if (!battle.playerCooldown.current || battle.isEnding.current) {
      return;
    }

    const targets = getTargets();

    const isAirSpecial = player.state === "falling" ||
      player.state === "jump" ||
      player.state === "preSpecialInAir" ||
      player.state === "specialInAir" ||
      player.state === "specialInAirFinish";

    if (isAirSpecial) {
      for (const target of targets) {
        if (target.id === "main") {
          if (Math.abs(player.x - target.x) < 150) {
            battle.specialHit(1.2, true);
            return;
          }
        }
      }
      battle.setDelicia(0);
      return;
    }

    for (const target of targets) {
      if (target.id === "main") {
        battle.specialHit();
        return;
      }
    }

    battle.setDelicia(0);
  }, [battle, getTargets, player.state, player.x]);

  return {
    handlePlayerHit,
    handleSpecialHit,
  };
}
