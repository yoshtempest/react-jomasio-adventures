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

export function Player() {
  const { progress } = useCharacterProgress();
  const { playTime, getTotalPlayTime } = usePlayTime();
  const { bestiary } = useBestiary();
  const { titlesData } = useTitles();
  const { flags } = useFlags();
  const { selectedChar } = usePlayerMenu(true);

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
      </div>
    </div>
  );
}

const TITLE_IDS = Object.keys(TITLES);
const FLAG_IDS = Object.keys(FLAGS) as FlagId[];
