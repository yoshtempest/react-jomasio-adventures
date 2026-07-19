import { useRef } from "react";
import styles from "./styles.module.css";
import { usePlayerMenu } from "@/hooks/menu/usePlayer";
import { useCharacterProgress } from "@/contexts/CharacterProgressContext";
import { usePlayTime } from "@/contexts/PlayTimeContext";
import { useBestiary } from "@/contexts/BestiaryContext";
import { useTitles } from "@/contexts/TitleContext";
import { useFlags } from "@/contexts/FlagContext";
import { CHARACTERS } from "@/utils/types/player/player";
import { CHARACTERS as CHARACTER_OPTIONS } from "@/data/options/characters";
import { TITLES } from "@/data/titles";
import { FLAGS } from "@/data/flags";
import { BESTIARY_NPC_ORDER } from "@/data/bestiary";
import { useRewards } from "@/hooks/useRewards";
import { useDailyReward } from "@/hooks/useDailyReward";
import { useMonthlyPass } from "@/hooks/useMonthlyPass";
import { useQuests } from "@/contexts/QuestContext";
import { SIDE_QUESTS } from "@/data/quests/sidequests";
import { getDeaths } from "@/utils/rewards/deathCounter";
import { getStreakStats } from "@/utils/rewards/streakStats";
import { getBlockCount } from "@/utils/rewards/blockCounter";
import {
  getDamageDealtStats,
  getDamageTakenStats,
  getHitsUsedStats,
  getSpecialsUsedStats,
  getAttacksUsedStats,
} from "@/utils/rewards/battleStats";
import { StatRow } from "./StatRow";
import { PlayerRewards } from "./PlayerRewards";
import { DailyRewardSection } from "./DailyReward";
import { MonthlyPassSection } from "./MonthlyPass";
import {
  getCharacterStats,
  getProgressStat,
  getSummaryStats,
} from "@/data/player/stats";

const TITLE_IDS = Object.keys(TITLES);
const FLAG_IDS = Object.keys(FLAGS) as FlagId[];

export function Player() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const claimRewardRef = useRef<(index: number) => boolean>(() => false);
  const rewardsCountRef = useRef(0);
  const { progress } = useCharacterProgress();
  const {
    playTime,
    battleTime,
    getTotalPlayTime,
    getTotalBattleTime,
    loginDays,
  } = usePlayTime();
  const { bestiary } = useBestiary();
  const { titlesData } = useTitles();
  const { flags } = useFlags();
  const { selectedChar, isSummaryView, subView, selectedRewardIndex } =
    usePlayerMenu(true, scrollRef, claimRewardRef, rewardsCountRef);
  const { rewards, claim } = useRewards();
  const {
    canClaim: dailyCanClaim,
    timer: dailyTimer,
    claim: claimDaily,
    hyperCoins: dailyHyperCoins,
    coinsMin: dailyCoinsMin,
    coinsMax: dailyCoinsMax,
  } = useDailyReward();
  const {
    missions: passMissions,
    currentMonth,
    completedCount,
    totalCount: passTotal,
    pct: passPct,
    claim: claimPass,
  } = useMonthlyPass();
  const { quests } = useQuests();

  const playerName = localStorage.getItem("playerName") || "Protagonista";

  const totalTitles = TITLE_IDS.length;
  const acquiredTitles = TITLE_IDS.filter(
    (id) => (titlesData.progress[id]?.level ?? 0) > 0,
  ).length;

  const totalNpcs = BESTIARY_NPC_ORDER.length;
  const encounteredNpcs = BESTIARY_NPC_ORDER.filter(
    (id) => bestiary[id]?.encountered,
  ).length;

  const totalStoryFlags = FLAG_IDS.length;
  const completedFlags = FLAG_IDS.filter((id) => flags.includes(id)).length;

  const maxLevelReached = Math.min(
    Math.max(...CHARACTERS.map((char) => progress[char]?.level ?? 0)),
    100,
  );

  const sideQuestIds = Object.keys(SIDE_QUESTS);
  const completedSideQuests = sideQuestIds.filter((id) => {
    const q = quests.find((q) => q.id === id);
    return q?.completed ?? false;
  }).length;
  const totalSideQuests = sideQuestIds.length;

  const totalPlayTime = getTotalPlayTime();
  const deaths = getDeaths();
  const streakStats = getStreakStats();
  const damageDealtStats = getDamageDealtStats();
  const damageTakenStats = getDamageTakenStats();
  const hitsUsedStats = getHitsUsedStats();
  const specialsUsedStats = getSpecialsUsedStats();
  const attacksUsedStats = getAttacksUsedStats();
  const blockCount = getBlockCount();

  function charLabel(char: string): string {
    const opt = CHARACTER_OPTIONS.find((c) => c.image === char);
    return opt?.name ?? char;
  }

  const totalCoins = CHARACTERS.reduce(
    (sum, c) => sum + (progress[c]?.coins ?? 0),
    0,
  );
  const totalHyperCoins = CHARACTERS.reduce(
    (sum, c) => sum + (progress[c]?.hyperCoins ?? 0),
    0,
  );

  const summaryStats = getSummaryStats({
    totalPlayTime,
    totalBattleTime: getTotalBattleTime(),
    coins: totalCoins,
    hyperCoins: totalHyperCoins,
    loginDays,
    totalKills: titlesData.totalKills,
    bestStreak: streakStats.bestStreak,
    totalDeaths: deaths.total,
    damageDealt: damageDealtStats.total,
    damageTaken: damageTakenStats.total,
    blocks: blockCount.total,
    hitsUsed: hitsUsedStats.total,
    specialsUsed: specialsUsedStats.total,
    attacksUsed: attacksUsedStats.total,
  });

  const characterStats = getCharacterStats({
    totalPlayTime: playTime[selectedChar],
    totalBattleTime: battleTime[selectedChar] ?? 0,
    coins: progress[selectedChar]?.coins ?? 0,
    hyperCoins: progress[selectedChar]?.hyperCoins ?? 0,
    totalKills: progress[selectedChar]?.kills ?? 0,
    bestStreak: streakStats.bestStreakPerCharacter[selectedChar] ?? 0,
    totalDeaths: deaths.perCharacter[selectedChar] ?? 0,
    damageDealt: damageDealtStats.perCharacter[selectedChar] ?? 0,
    damageTaken: damageTakenStats.perCharacter[selectedChar] ?? 0,
    blocks: blockCount.perCharacter[selectedChar] ?? 0,
    hitsUsed: hitsUsedStats.perCharacter[selectedChar] ?? 0,
    specialsUsed: specialsUsedStats.perCharacter[selectedChar] ?? 0,
    attacksUsed: attacksUsedStats.perCharacter[selectedChar] ?? 0,
  });

  claimRewardRef.current = (index: number): boolean => {
    const r = rewards[index];
    if (r?.canClaim) {
      claim(r.id);
      return true;
    }
    return false;
  };
  rewardsCountRef.current = rewards.length;

  const progressStats = getProgressStat({
    acquiredTitles,
    totalTitles,
    encounteredNpcs,
    totalNpcs,
    completedFlags,
    totalStoryFlags,
    maxLevelReached,
    completedSideQuests,
    totalSideQuests,
  });

  return (
    <div className="containerOfNavbar">
      <h2>{playerName}</h2>

      {subView === "rewards" ? (
        <PlayerRewards
          rewards={rewards}
          selectedRewardIndex={selectedRewardIndex}
          onClaim={claim}
        />
      ) : (
        <div ref={scrollRef} className={styles.container}>
          <div className={styles.charSelectRow}>
            <span
              className={`${styles.charBtn} ${
                isSummaryView ? styles.charBtnActive : ""
              }`}
            >
              Resumo
            </span>
            {CHARACTERS.map((char) => (
              <span
                key={char}
                className={`${styles.charBtn} ${
                  !isSummaryView && char === selectedChar
                    ? styles.charBtnActive
                    : ""
                }`}
              >
                {charLabel(char)}
              </span>
            ))}
          </div>

          {isSummaryView ? (
            <div className={styles.section}>
              <div className={styles.sectionTitle}>Resumo</div>
              {summaryStats.map((stat) => (
                <StatRow
                  key={stat.label}
                  label={stat.label}
                  value={stat.value}
                />
              ))}
            </div>
          ) : (
            <div className={styles.section}>
              <div className={styles.sectionTitle}>
                {charLabel(selectedChar)}
              </div>
              {characterStats.map((stat) => (
                <StatRow
                  key={stat.label}
                  label={stat.label}
                  value={stat.value}
                />
              ))}
            </div>
          )}

          <div className={styles.section}>
            <div className={styles.sectionTitle}>Progresso</div>

            {progressStats.map((stat) => (
              <StatRow
                key={stat.label}
                label={stat.label}
                value={stat.value}
                progress={stat.progress}
              />
            ))}
          </div>

          <button className={styles.rewardsButton}>Recompensas</button>

          <DailyRewardSection
            canClaim={dailyCanClaim}
            timer={dailyTimer}
            hyperCoins={dailyHyperCoins}
            coinsMin={dailyCoinsMin}
            coinsMax={dailyCoinsMax}
            onClaim={claimDaily}
          />

          <MonthlyPassSection
            currentMonth={currentMonth}
            completedCount={completedCount}
            passTotal={passTotal}
            passPct={passPct}
            missions={passMissions}
            onClaimMission={claimPass}
          />
        </div>
      )}
    </div>
  );
}
