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
import { usePlayer } from "@/contexts/PlayerContext";
import { useRewards } from "@/hooks/useRewards";
import { useDailyReward } from "@/hooks/useDailyReward";
import { useMonthlyPass } from "@/hooks/useMonthlyPass";
import { getDeaths } from "@/utils/rewards/deathCounter";
import { getStreakStats } from "@/utils/rewards/streakStats";
import { getBlockCount } from "@/utils/rewards/blockCounter";
import {
  getDamageDealtStats,
  getDamageTakenStats,
  getMissesStats,
  getEquipmentDropsStats,
  getHitsUsedStats,
  getSpecialsUsedStats,
  getAttacksUsedStats,
} from "@/utils/rewards/battleStats";
import { StatRow } from "./StatRow";
import { getCharacterStats, getSummaryStats } from "@/data/player/stats";

export function Player() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { progress } = useCharacterProgress();
  const { playTime, battleTime, getTotalPlayTime, getTotalBattleTime, loginDays } = usePlayTime();
  const { bestiary } = useBestiary();
  const { titlesData } = useTitles();
  const { coins, hyperCoins } = usePlayer();
  const { flags } = useFlags();
  const { selectedChar } = usePlayerMenu(true, scrollRef);
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

  const totalTitles = TITLE_IDS.length;
  const acquiredTitles = TITLE_IDS.filter((id) => (titlesData.progress[id]?.level ?? 0) > 0).length;
  const titlePct = totalTitles > 0 ? Math.round((acquiredTitles / totalTitles) * 100) : 0;

  const totalNpcs = BESTIARY_NPC_ORDER.length;
  const encounteredNpcs = BESTIARY_NPC_ORDER.filter((id) => bestiary[id]?.encountered).length;
  const npcPct = totalNpcs > 0 ? Math.round((encounteredNpcs / totalNpcs) * 100) : 0;

  const totalStoryFlags = FLAG_IDS.length;
  const completedFlags = FLAG_IDS.filter((id) => flags.includes(id)).length;
  const storyPct = totalStoryFlags > 0 ? Math.round((completedFlags / totalStoryFlags) * 100) : 0;

  const totalPlayTime = getTotalPlayTime();
  const deaths = getDeaths();
  const streakStats = getStreakStats();
  const damageDealtStats = getDamageDealtStats();
  const damageTakenStats = getDamageTakenStats();
  const missesStats = getMissesStats();
  const equipmentDropsStats = getEquipmentDropsStats();
  const hitsUsedStats = getHitsUsedStats();
  const specialsUsedStats = getSpecialsUsedStats();
  const attacksUsedStats = getAttacksUsedStats();
  const blockCount = getBlockCount();

  function charLabel(char: string): string {
    const opt = CHARACTER_OPTIONS.find((c) => c.image === char);
    return opt?.name ?? char;
  }

  const summaryStats = getSummaryStats({
    totalPlayTime,
    totalBattleTime: getTotalBattleTime(),
    coins,
    hyperCoins,
    loginDays,
    totalKills: titlesData.totalKills,
    bestStreak: streakStats.bestStreak,
    totalDeaths: deaths.total,
    damageDealt: damageDealtStats.total,
    damageTaken: damageTakenStats.total,
    blocks: blockCount.total,
    misses: missesStats.total,
    equipmentDrops: equipmentDropsStats.total,
    hitsUsed: hitsUsedStats.total,
    specialsUsed: specialsUsedStats.total,
    attacksUsed: attacksUsedStats.total,
  });

  const characterStats = getCharacterStats({
    playTime: playTime[selectedChar],
    battleTime: battleTime[selectedChar] ?? 0,
    totalPlayTime,
    kills: progress[selectedChar]?.kills ?? 0,
    bestStreak: streakStats.bestStreakPerCharacter[selectedChar] ?? 0,
    deaths: deaths.perCharacter[selectedChar] ?? 0,
    damageDealt: damageDealtStats.perCharacter[selectedChar] ?? 0,
    damageTaken: damageTakenStats.perCharacter[selectedChar] ?? 0,
  });

  return (
    <div className="containerOfNavbar">
      <h2>Jogador</h2>

      <div ref={scrollRef} className={styles.container}>
        <div className={styles.charSelectRow}>
          {CHARACTERS.map((char) => (
            <span
              key={char}
              className={`${styles.charBtn} ${
                char === selectedChar ? styles.charBtnActive : ""
              }`}
            >
              {charLabel(char)}
            </span>
          ))}
        </div>

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

        <div className={styles.section}>
          <div className={styles.sectionTitle}>{charLabel(selectedChar)}</div>
          {characterStats.map((stat) => (
            <StatRow
              key={stat.label}
              label={stat.label}
              value={stat.value}
            />
          ))}
        </div>

        <div className={styles.section}>
          <div className={styles.sectionTitle}>Progresso</div>

          <div className={styles.statRow}>
            <span className={styles.statLabel}>Títulos</span>
            <span className={styles.statValue}>
              {acquiredTitles}/{totalTitles}
              <span className={styles.statPct}>({titlePct}%)</span>
            </span>
          </div>
          <div className={styles.barOuter}>
            <div className={styles.barInner} style={{ width: `${titlePct}%` }} />
          </div>

          <div className={styles.statRow}>
            <span className={styles.statLabel}>NPCs encontrados</span>
            <span className={styles.statValue}>
              {encounteredNpcs}/{totalNpcs}
              <span className={styles.statPct}>({npcPct}%)</span>
            </span>
          </div>
          <div className={styles.barOuter}>
            <div className={styles.barInner} style={{ width: `${npcPct}%` }} />
          </div>

          <div className={styles.statRow}>
            <span className={styles.statLabel}>História</span>
            <span className={styles.statValue}>
              {completedFlags}/{totalStoryFlags}
              <span className={styles.statPct}>({storyPct}%)</span>
            </span>
          </div>
          <div className={styles.barOuter}>
            <div className={styles.barInner} style={{ width: `${storyPct}%` }} />
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionTitle}>Recompensas</div>

          {rewards.map((r) => (
            <div key={r.id} className={styles.rewardRow}>
              <div className={styles.rewardInfo}>
                <span className={styles.rewardLabel}>{r.label}</span>
                <span className={styles.rewardProgress}>
                  {r.current}/{r.requirement}
                </span>
              </div>
              <div className={styles.rewardAction}>
                <span className={styles.rewardValue}>+{r.reward} HyperCoins</span>
                <button
                  className={r.canClaim ? styles.claimBtn : styles.claimBtnDone}
                  disabled={!r.canClaim}
                  onClick={() => claim(r.id)}
                >
                  {r.canClaim ? "Receber" : "OK"}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.section}>
          <div className={styles.sectionTitle}>Recompensa Diária</div>
          <div className={styles.dailyCard}>
            <div className={styles.dailyInfo}>
              <span className={styles.dailyLabel}>
                {dailyCanClaim ? "Disponível!" : "Já recebida hoje"}
              </span>
              <span className={styles.dailyRewards}>
                +{dailyHyperCoins} HyperCoins · {dailyCoinsMin}–{dailyCoinsMax} Kwanzas
              </span>
              {!dailyCanClaim && (
                <span className={styles.dailyTimer}>{dailyTimer}</span>
              )}
            </div>
            <button
              className={dailyCanClaim ? styles.claimBtn : styles.claimBtnDone}
              disabled={!dailyCanClaim}
              onClick={claimDaily}
            >
              {dailyCanClaim ? "Receber" : "Amanhã"}
            </button>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionTitle}>Passe Mensal — {formatMonth(currentMonth)}</div>
          <div className={styles.statRow}>
            <span className={styles.statLabel}>Progresso</span>
            <span className={styles.statValue}>{completedCount}/{passTotal} ({passPct}%)</span>
          </div>
          <div className={styles.barOuter}>
            <div className={styles.barInner} style={{ width: `${passPct}%` }} />
          </div>
          {passMissions.map((m) => (
            <div key={m.id} className={styles.missionRow}>
              <div className={styles.missionInfo}>
                <span className={styles.missionLabel}>{m.label}</span>
                <span className={styles.missionProgress}>
                  {m.completed ? "Completa" : `${m.progress}/${m.requirement}`}
                </span>
              </div>
              <div className={styles.missionAction}>
                <span className={styles.missionReward}>+{m.reward}</span>
                <button
                  className={m.canClaim ? styles.claimBtn : styles.claimBtnDone}
                  disabled={!m.canClaim}
                  onClick={() => claimPass(m.id)}
                >
                  {m.claimed ? "OK" : m.completed ? "Receber" : "—"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function formatMonth(ym: string): string {
  const [y, m] = ym.split("-").map(Number);
  const months = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
  ];
  return `${months[m - 1]} ${y}`;
}

const TITLE_IDS = Object.keys(TITLES);
const FLAG_IDS = Object.keys(FLAGS) as FlagId[];
