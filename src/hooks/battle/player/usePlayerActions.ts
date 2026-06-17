import { useCallback } from "react";

import { calculatePlayerDamage } from "@/gameRules/battle/damage";
import { isPlayerInRange } from "@/gameRules/battle/range";
import { isFacingTarget } from "@/gameRules/battle/direction";

import type { SummonedNpc } from "@/utils/types/npc/npc";
import type { CharactersProgress } from "@/contexts/CharacterProgressContext";
import type { DamageType } from "@/hooks/battle/useDamageNumbers";

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
  playerMaxHp,
  totalVampirism,
}: Props) {
  const handlePlayerHit = useCallback(() => {
    if (!battle.playerCooldown.current || battle.isEnding.current) {
      return;
    }

    const targets: {
      id: string;
      x: number;
      y: number;
    }[] = [];

    if (npcHP > 0) {
      targets.push({
        id: "main",
        x: npc.x,
        y: npc.y,
      });
    }

    for (const summon of summons) {
      if (summon.hp > 0 && !summon.isDying) {
        targets.push({
          id: summon.id,
          x: summon.x,
          y: summon.y,
        });
      }
    }

    targets.sort((a, b) => {
      const da = Math.abs(player.x - a.x);
      const db = Math.abs(player.x - b.x);

      return da - db;
    });

    const char = progress[player.character];

    for (const target of targets) {
      if (target.id === "main") {
        battle.playerHit();
        return;
      }

      if (
        isPlayerInRange(
          player.x,
          player.y,
          target.x,
          target.y,
          player.state,
          player.character,
          false,
        ) &&
        isFacingTarget(
          player.x,
          player.y,
          target.x,
          target.y,
          player.battleDirection,
        )
      ) {
        const targetSummon = summons.find((summon) => summon.id === target.id);

        if (!targetSummon) {
          return;
        }

        const damage = Math.round(
          calculatePlayerDamage(char.stats.strength, playerClass),
        );

        spawnDamageRef.current?.(damage, target.x, target.y, "summon");
        registerHitRef.current?.(damage);
        battle.setDelicia((d) => Math.min(d + 1, battle.hitsToSpecial));

        if (totalVampirism > 0) {
          const heal = Math.round(damage * totalVampirism / 100);
          if (heal > 0) setPlayerHP((hp) => Math.min(playerMaxHp, hp + heal));
        }

        const newHp = Math.max(0, Math.round(targetSummon.hp) - damage);

        if (newHp <= 0) {
          giveSummonRewards("rare");
        }

        setSummons((prev) =>
          prev.map((summon) =>
            summon.id === target.id
              ? {
                  ...summon,
                  hp: newHp,
                }
              : summon,
          ),
        );

        return;
      }
    }
  }, [
    player,
    npc,
    npcHP,
    summons,
    progress,
    playerClass,
    battle,
    setSummons,
    giveSummonRewards,
    spawnDamageRef,
    registerHitRef,
    setPlayerHP,
    playerMaxHp,
    totalVampirism,
  ]);

  const handleSpecialHit = useCallback(() => {
    if (!battle.playerCooldown.current || battle.isEnding.current) {
      return;
    }

    const targets = [];

    if (npcHP > 0) {
      targets.push({
        id: "main",
        x: npc.x,
        y: npc.y,
      });
    }

    for (const summon of summons) {
      if (summon.hp > 0 && !summon.isDying) {
        targets.push({
          id: summon.id,
          x: summon.x,
          y: summon.y,
        });
      }
    }

    targets.sort((a, b) => {
      const da = Math.abs(player.x - a.x);
      const db = Math.abs(player.x - b.x);

      return da - db;
    });

    for (const target of targets) {
      if (target.id === "main") {
        battle.specialHit();
        return;
      }
    }
  }, [player, npc, npcHP, summons, battle]);

  return {
    handlePlayerHit,
    handleSpecialHit,
  };
}
