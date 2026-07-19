import { isCharRewardId, type RewardDef } from "@/data/rewards";
import { REWARDS_KEY } from "@/data/storageKeys";
import { getBlockCount } from "@/utils/rewards/blockCounter";
import {
  getDamageDealtStats,
  getDamageTakenStats,
  getMissesStats,
  getHitsUsedStats,
  getSpecialsUsedStats,
  getAttacksUsedStats,
} from "@/utils/rewards/battleStats";

export type RewardsProgress = Record<string, number>;

export function loadProgress(): RewardsProgress {
  try {
    const raw = localStorage.getItem(REWARDS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveProgress(data: RewardsProgress): void {
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

export function getUnlockedCount(flags: FlagId[]): number {
  let count = 0;
  for (const flag of Object.values(CHAR_TO_FLAG)) {
    if (flags.includes(flag)) count++;
  }
  return count + 2;
}

export function getMaxNpcKills(
  bestiary: Record<string, { kills: number }>,
): number {
  let max = 0;
  for (const entry of Object.values(bestiary)) {
    if (entry.kills > max) max = entry.kills;
  }
  return max;
}

export function getProgress(
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
      return {
        current: getDamageDealtStats().total,
        requirement: def.getRequirement(stage),
      };
    case "damage_taken":
      return {
        current: getDamageTakenStats().total,
        requirement: def.getRequirement(stage),
      };
    case "blocks":
      return {
        current: getBlockCount().total,
        requirement: def.getRequirement(stage),
      };
    case "misses":
      return {
        current: getMissesStats().total,
        requirement: def.getRequirement(stage),
      };
    case "hits_used":
      return {
        current: getHitsUsedStats().total,
        requirement: def.getRequirement(stage),
      };
    case "specials_used":
      return {
        current: getSpecialsUsedStats().total,
        requirement: def.getRequirement(stage),
      };
    case "attacks_used":
      return {
        current: getAttacksUsedStats().total,
        requirement: def.getRequirement(stage),
      };
    default: {
      const parsed = isCharRewardId(def.id);
      if (!parsed) return { current: 0, requirement: 0 };

      const level = charsProgress[parsed.charId]?.level ?? 0;
      switch (parsed.type) {
        case "level":
          return { current: level, requirement: def.getRequirement(stage) };
        case "damage":
          return {
            current: getDamageDealtStats().perCharacter[parsed.charId] ?? 0,
            requirement: def.getRequirement(stage),
          };
        case "specials":
          return {
            current: getSpecialsUsedStats().perCharacter[parsed.charId] ?? 0,
            requirement: def.getRequirement(stage),
          };
        case "hits":
          return {
            current: getHitsUsedStats().perCharacter[parsed.charId] ?? 0,
            requirement: def.getRequirement(stage),
          };
        case "attacks":
          return {
            current: getAttacksUsedStats().perCharacter[parsed.charId] ?? 0,
            requirement: def.getRequirement(stage),
          };
        default:
          return { current: 0, requirement: 0 };
      }
    }
  }
}
