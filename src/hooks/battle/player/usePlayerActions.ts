import { useCallback, useRef, useEffect } from "react";

import {
  PLAYER_BASIC_COOLDOWN,
  PLAYER_SPECIAL_COOLDOWN,
} from "@/data/cooldowns";
import { playAttackSound } from "@/utils/types/battle/playAttackSound";
import { isPlayerInRange } from "@/gameRules/battle/range";
import { NPC_CLASS_HITBOX_BONUS } from "@/gameRules/battle/rangeConfig";
import { isFacingTarget } from "@/gameRules/battle/direction";
import { damageSummon } from "@/gameRules/battle/damageSummon";
import { useBuildTargetList } from "./usePlayerTargeting";

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
  npcClass: NPCClass;
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
  npcClass,
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
    npcClass,
  );

  const hitSummon = useCallback(
    (
      target: { id: string; x: number; y: number },
      multiplier: number,
      pushDir?: number,
    ) => {
      return damageSummon({
        target,
        multiplier,
        player,
        playerClass,
        progress,
        playerHP,
        playerMaxHp,
        totalVampirism,
        summons,
        setSummons,
        giveSummonRewards,
        spawnDamageRef,
        registerHitRef,
        setPlayerHP,
        deliciaSetter: battle.setDelicia,
        hitsToSpecial: battle.hitsToSpecial,
        pushDir,
      });
    },
    [
      player,
      playerClass,
      progress,
      playerHP,
      playerMaxHp,
      totalVampirism,
      summons,
      setSummons,
      giveSummonRewards,
      spawnDamageRef,
      registerHitRef,
      setPlayerHP,
      battle,
    ],
  );

  const hitTargetList = useCallback(
    (
      targets: { id: string; x: number; y: number }[],
      multiplier: number,
      isSpecial: boolean,
    ) => {
      let hitMain = false;
      const pushDir = player.battleDirection === "right" ? 1 : -1;

      for (const target of targets) {
        if (target.id === "main") {
          hitMain = true;
          if (isSpecial) {
            battle.specialHit(multiplier, true);
          } else {
            onNpcPush?.(npc.x + pushDir * 20);
            battle.playerHit(multiplier, true);
          }
          continue;
        }

        const targetSummon = summons.find((summon) => summon.id === target.id);
        if (!targetSummon) continue;

        hitSummon(target, multiplier, isSpecial ? undefined : pushDir);
      }

      if (!hitMain) {
        playAttackSound(player.character);
        battle.playerCooldown.current = false;
        setTimeout(() => {
          battle.playerCooldown.current = true;
        }, isSpecial ? PLAYER_SPECIAL_COOLDOWN : PLAYER_BASIC_COOLDOWN);
      }
    },
    [player, npc.x, battle, onNpcPush, summons, hitSummon],
  );

  const handlePlayerHit = useCallback(() => {
    if (!battle.playerCooldown.current || battle.isEnding.current) {
      return;
    }

    const targets = getTargets();
    const mainTarget = targets.find((t) => t.id === "main");

    if (player.state === "blocked") {
      const areaTargets = targets.filter(
        (target) =>
          isPlayerInRange(
            player.x,
            player.y,
            target.x,
            target.y,
            player.state,
            player.character,
            false,
            true,
            target.id === "main" ? npcClass : "common",
          ) &&
          isFacingTarget(
            player.x,
            player.y,
            target.x,
            target.y,
            player.battleDirection,
          ),
      );

      if (areaTargets.length === 0) return;

      hitTargetList(areaTargets, 0.7, false);
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
      hitSummon(target, 1);

      battle.playerCooldown.current = false;
      setTimeout(() => {
        battle.playerCooldown.current = true;
      }, PLAYER_BASIC_COOLDOWN);

      return;
    }
  }, [
    player,
    summons,
    battle,
    getTargets,
    isInAttackRange,
    hitSummon,
    hitTargetList,
    npcClass,
  ]);

  const handleSpecialHit = useCallback(() => {
    if (!battle.playerCooldown.current || battle.isEnding.current) {
      return;
    }

    const targets = getTargets();

    const isAirSpecial =
      player.state === "falling" ||
      player.state === "jump" ||
      player.state === "preSpecialInAir" ||
      player.state === "specialInAir" ||
      player.state === "specialInAirFinish";

    if (isAirSpecial) {
      const inRangeTargets = targets.filter(
        (target) =>
          Math.abs(player.x - target.x) <
          150 + (target.id === "main" ? NPC_CLASS_HITBOX_BONUS[npcClass] : 0),
      );

      if (inRangeTargets.length === 0) {
        battle.setDelicia(0);
        return;
      }

      hitTargetList(inRangeTargets, 1.2, true);
      return;
    }

    for (const target of targets) {
      if (target.id === "main") {
        battle.specialHit();
        return;
      }
    }

    battle.setDelicia(0);
  }, [
    battle,
    getTargets,
    player.state,
    player.x,
    hitTargetList,
    npcClass,
  ]);

  return {
    handlePlayerHit,
    handleSpecialHit,
  };
}
