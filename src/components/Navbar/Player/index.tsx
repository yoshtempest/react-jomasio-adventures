import styles from "./styles.module.css";
import { usePlayerMenu } from "@/hooks/menu/usePlayer";
import { useCharacterProgress } from "@/contexts/CharacterProgressContext";
import { usePlayTime, formatTime } from "@/contexts/PlayTimeContext";
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

export function Player() {
  const { progress } = useCharacterProgress();
  const { playTime, battleTime, getTotalPlayTime, getTotalBattleTime, loginDays } = usePlayTime();
  const { bestiary } = useBestiary();
  const { titlesData } = useTitles();
  const { coins, hyperCoins } = usePlayer();
  const { flags } = useFlags();
  const { selectedChar } = usePlayerMenu(true);
  const { rewards, claim } = useRewards();

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

  function charLabel(char: string): string {
    const opt = CHARACTER_OPTIONS.find((c) => c.image === char);
    return opt?.name ?? char;
  }

  return (
    <div className="containerOfNavbar">
      <h2>Jogador</h2>

      <div className={styles.container}>
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
          <div className={styles.statRow}>
            <span className={styles.statLabel}>Tempo total</span>
            <span className={styles.statValue}>{formatTime(totalPlayTime)}</span>
          </div>
          <div className={styles.statRow}>
            <span className={styles.statLabel}>Total de inimigos derrotados</span>
            <span className={styles.statValue}>{titlesData.totalKills}</span>
          </div>
          <div className={styles.statRow}>
            <span className={styles.statLabel}>Kwanzas</span>
            <span className={styles.statValue}>{coins}</span>
          </div>
          <div className={styles.statRow}>
            <span className={styles.statLabel}>HyperCoins</span>
            <span className={styles.statValue}>{hyperCoins}</span>
          </div>
          <div className={styles.statRow}>
            <span className={styles.statLabel}>Tempo em batalha</span>
            <span className={styles.statValue}>{formatTime(getTotalBattleTime())}</span>
          </div>
          <div className={styles.statRow}>
            <span className={styles.statLabel}>Dias jogados</span>
            <span className={styles.statValue}>{loginDays}</span>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionTitle}>{charLabel(selectedChar)}</div>
          <div className={styles.statRow}>
            <span className={styles.statLabel}>Tempo jogado</span>
            <span className={styles.statValue}>{formatTime(playTime[selectedChar])}</span>
          </div>
          <div className={styles.statRow}>
            <span className={styles.statLabel}>% do tempo total</span>
            <span className={styles.statValue}>
              {totalPlayTime > 0
                ? Math.round((playTime[selectedChar] / totalPlayTime) * 100)
                : 0}
              %
            </span>
          </div>
          <div className={styles.statRow}>
            <span className={styles.statLabel}>Inimigos derrotados</span>
            <span className={styles.statValue}>
              {progress[selectedChar]?.kills ?? 0}
            </span>
          </div>
          <div className={styles.statRow}>
            <span className={styles.statLabel}>Tempo em batalha</span>
            <span className={styles.statValue}>{formatTime(battleTime[selectedChar] ?? 0)}</span>
          </div>
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
      </div>
    </div>
  );
}

const TITLE_IDS = Object.keys(TITLES);
const FLAG_IDS = Object.keys(FLAGS) as FlagId[];
