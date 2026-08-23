import {
  incrementAttacksUsedStats,
  incrementHitsUsedStats,
} from "@/utils/rewards/battleStats";
import { BATTLE_LIMITS } from "@/gameRules/movement/constants";
import type { SummonedNpc } from "@/utils/types/npc/npc";
import type { CharactersProgress } from "@/data/characters/defaultProgress";
import { CHARACTER_ELEMENT_TYPES } from "@/data/types/characterElementTypes";
import { NPC_ELEMENT_TYPES } from "@/data/types/npcElementTypes";
import { combatService } from "@/services/combat";

type Params = {
  target: { id: string; x: number; y: number };
  multiplier: number;
  player: Player;
  playerClass: PlayerClass;
  progress: CharactersProgress;
  playerHP: number;
  playerMaxHp: number;
  totalVampirism: number;
  summons: SummonedNpc[];
  setSummons: React.Dispatch<React.SetStateAction<SummonedNpc[]>>;
  giveSummonRewards: (npcClass: NPCClass) => void;
  spawnDamageRef: React.RefObject<
    (value: number, x: number, y: number, type: DamageType) => void
  >;
  registerHitRef: React.RefObject<(damage: number) => void>;
  setPlayerHP: React.Dispatch<React.SetStateAction<number>>;
  deliciaSetter: React.Dispatch<React.SetStateAction<number>>;
  hitsToSpecial: number;
  pushDir?: number;
};

export function damageSummon({
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
  deliciaSetter,
  hitsToSpecial,
  pushDir,
}: Params) {
  const char = progress[player.character];
  const raw = combatService.calculatePlayerDamage(char.stats.strength, playerClass);
  const targetSummon = summons.find((s) => s.id === target.id);
  const elementMultiplier = combatService.getElementMultiplier(
    CHARACTER_ELEMENT_TYPES[player.character],
    targetSummon ? (NPC_ELEMENT_TYPES[targetSummon.npcType] ?? []) : [],
  );
  const dmg = Math.round(
    (player.character === "samuel" && char.level >= 20
      ? raw * combatService.getBerserkMultiplier(playerHP, playerMaxHp)
      : raw) *
      multiplier *
      elementMultiplier,
  );

  spawnDamageRef.current?.(
    dmg,
    target.x,
    target.y,
    multiplier >= 1.2 ? "special" : "summon",
  );
  registerHitRef.current?.(dmg);
  deliciaSetter((d) => Math.min(d + 1, hitsToSpecial));
  incrementAttacksUsedStats(player.character);
  incrementHitsUsedStats(player.character);

  if (totalVampirism > 0) {
    const heal = Math.round((dmg * totalVampirism) / 100);
    if (heal > 0) setPlayerHP((hp) => Math.min(playerMaxHp, hp + heal));
  }

  const newHp = Math.max(
    0,
    Math.round((summons.find((s) => s.id === target.id)?.hp ?? 0) - dmg),
  );
  if (newHp <= 0) giveSummonRewards("rare");

  setSummons((prev) =>
    prev.map((summon) =>
      summon.id === target.id
        ? {
            ...summon,
            hp: newHp,
            ...(pushDir != null
              ? {
                  x: Math.max(
                    BATTLE_LIMITS.minX,
                    Math.min(BATTLE_LIMITS.maxX, summon.x + pushDir * 20),
                  ),
                }
              : {}),
          }
        : summon,
    ),
  );

  return dmg;
}
