import type { MonthlyMissionDef } from "@/data/rewards/monthlyPass";
import { getBlockCount, getDamageDealtStats } from "@/utils/rewards";

export function getMissionProgress(
  def: MonthlyMissionDef,
  totalKills: number,
  totalPlayTime: number,
  loginDays: number,
  classKills: Record<string, number>,
): number {
  switch (def.id) {
    case "kill_enemies":
      return totalKills;
    case "play_time":
      return Math.floor(totalPlayTime / 3600);
    case "kill_boss":
      return classKills.boss ?? 0;
    case "kill_legendary":
      return classKills.legendary ?? 0;
    case "damage_dealt":
      return getDamageDealtStats().total;
    case "blocks":
      return getBlockCount().total;
    case "login_days":
      return loginDays;
    default:
      return 0;
  }
}
