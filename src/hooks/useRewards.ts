import { useState, useCallback } from "react";
import { REWARDS, isCharRewardId, type RewardDef } from "@/data/rewards";
import { REWARDS_KEY } from "@/data/storageKeys";
import { usePlayer } from "@/contexts/PlayerContext";
import { useCharacterProgress } from "@/contexts/CharacterProgressContext";
import { useTitles } from "@/contexts/TitleContext";
import { usePlayTime } from "@/contexts/PlayTimeContext";
import { useFlags } from "@/contexts/FlagContext";
import { useBestiary } from "@/contexts/BestiaryContext";
import { getClassKills } from "@/utils/rewards/classKills";
import { getBlockCount } from "@/utils/rewards/blockCounter";
import {
  getDamageDealtStats,
  getDamageTakenStats,
  getMissesStats,
  getHitsUsedStats,
  getSpecialsUsedStats,
  getAttacksUsedStats,
} from "@/utils/rewards/battleStats";
import type { Character } from "@/utils/types/player/player";

type RewardsProgress = Record<string, number>;

function loadProgress(): RewardsProgress {
  try {
    const raw = localStorage.getItem(REWARDS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveProgress(data: RewardsProgress): void {
  try {
    localStorage.setItem(REWARDS_KEY, JSON.stringify(data));
  } catch {}
}

const CHAR_TO_FLAG: Record<string, FlagId> = {
  samuel: "samurionUnlocked",
  artur: "srGuaxinimUnlocked",
  emanuel: "ematronUnlocked",
  larissa: "laricellUnlocked",
  mayra: "yraUnlocked",
  camilly: "kamykazeUnlocked",
  lucas: "yvelUnlocked",
  lucaua: "babidiUnlocked",
  riquelme: "riquelsonUnlocked",
};

function getUnlockedCount(flags: FlagId[]): number {
  let count = 0;
  for (const flag of Object.values(CHAR_TO_FLAG)) {
    if (flags.includes(flag)) count++;
  }
  return count + 2;
}

function getMaxNpcKills(bestiary: Record<string, { kills: number }>): number {
  let max = 0;
  for (const entry of Object.values(bestiary)) {
    if (entry.kills > max) max = entry.kills;
  }
  return max;
}

function getProgress(
  def: RewardDef,
  stage: number,
  totalKills: number,
  totalPlayTime: number,
  unlockedCount: number,
  maxNpcKills: number,
  classKills: Record<string, number>,
  charsProgress: Record<string, { level: number }>,
): { current: number; requirement: number } {
  switch (def.id) {
    case "kill_enemies":
      return { current: totalKills, requirement: def.getRequirement(stage) };
    case "play_time":
      return {
        current: Math.floor(totalPlayTime / 3600),
        requirement: def.getRequirement(stage),
      };
    case "unlock_chars":
      return { current: unlockedCount, requirement: def.getRequirement(stage) };
    case "kill_same_npc":
      return { current: maxNpcKills, requirement: def.getRequirement(stage) };
    case "kill_legendary":
      return {
        current: classKills.legendary ?? 0,
        requirement: def.getRequirement(stage),
      };
    case "kill_boss":
      return {
        current: classKills.boss ?? 0,
        requirement: def.getRequirement(stage),
      };
    case "kill_rare":
      return {
        current: classKills.rare ?? 0,
        requirement: def.getRequirement(stage),
      };
    case "damage_dealt":
      return { current: getDamageDealtStats().total, requirement: def.getRequirement(stage) };
    case "damage_taken":
      return { current: getDamageTakenStats().total, requirement: def.getRequirement(stage) };
    case "blocks":
      return { current: getBlockCount().total, requirement: def.getRequirement(stage) };
    case "misses":
      return { current: getMissesStats().total, requirement: def.getRequirement(stage) };
    case "hits_used":
      return { current: getHitsUsedStats().total, requirement: def.getRequirement(stage) };
    case "specials_used":
      return { current: getSpecialsUsedStats().total, requirement: def.getRequirement(stage) };
    case "attacks_used":
      return { current: getAttacksUsedStats().total, requirement: def.getRequirement(stage) };
    default: {
      const parsed = isCharRewardId(def.id);
      if (!parsed) return { current: 0, requirement: 0 };

      const level = charsProgress[parsed.charId]?.level ?? 0;
      switch (parsed.type) {
        case "level":
          return { current: level, requirement: def.getRequirement(stage) };
        case "damage":
          return { current: getDamageDealtStats().perCharacter[parsed.charId] ?? 0, requirement: def.getRequirement(stage) };
        case "specials":
          return { current: getSpecialsUsedStats().perCharacter[parsed.charId] ?? 0, requirement: def.getRequirement(stage) };
        case "hits":
          return { current: getHitsUsedStats().perCharacter[parsed.charId] ?? 0, requirement: def.getRequirement(stage) };
        case "attacks":
          return { current: getAttacksUsedStats().perCharacter[parsed.charId] ?? 0, requirement: def.getRequirement(stage) };
        default:
          return { current: 0, requirement: 0 };
      }
    }
  }
}

export type RewardInfo = {
  id: string;
  label: string;
  current: number;
  requirement: number;
  reward: number;
  canClaim: boolean;
  charId?: string;
};

export function useRewards() {
  const { player } = usePlayer();
  const { progress: charsProgress, addHyperCoins } = useCharacterProgress();
  const { titlesData } = useTitles();
  const { getTotalPlayTime } = usePlayTime();
  const { flags } = useFlags();
  const { bestiary } = useBestiary();

  const [progress, setProgress] = useState<RewardsProgress>(loadProgress);

  const totalKills = titlesData.totalKills;
  const totalPlayTime = getTotalPlayTime();
  const unlockedCount = getUnlockedCount(flags);
  const maxNpcKills = getMaxNpcKills(bestiary as unknown as Record<string, { kills: number }>);
  const classKills = getClassKills();

  const claim = useCallback(
    (rewardId: string) => {
      const def = REWARDS.find((r) => r.id === rewardId);
      if (!def) return;

      const stage = progress[rewardId] ?? 0;
      const { current, requirement } = getProgress(
        def,
        stage,
        totalKills,
        totalPlayTime,
        unlockedCount,
        maxNpcKills,
        classKills,
        charsProgress,
      );

      if (current < requirement) return;

      const reward = def.getReward(stage);
      const parsed = isCharRewardId(rewardId);
      const recipient = parsed ? (parsed.charId as Character) : player.character;
      addHyperCoins(recipient, reward);

      setProgress((prev) => {
        const next = { ...prev, [rewardId]: stage + 1 };
        saveProgress(next);
        return next;
      });
    },
    [progress, totalKills, totalPlayTime, unlockedCount, maxNpcKills, classKills, charsProgress, player.character, addHyperCoins],
  );

  const rewards = REWARDS.map((def) => {
    const stage = progress[def.id] ?? 0;
    const { current, requirement } = getProgress(
      def,
      stage,
      totalKills,
      totalPlayTime,
      unlockedCount,
      maxNpcKills,
      classKills,
      charsProgress,
    );
    const reward = def.getReward(stage);
    const canClaim = current >= requirement;
    const parsed = isCharRewardId(def.id);

    return {
      id: def.id,
      label: def.label.replace("{req}", String(requirement)),
      current,
      requirement,
      reward,
      canClaim,
      charId: parsed?.charId,
    };
  });

  return { rewards, claim };
}
