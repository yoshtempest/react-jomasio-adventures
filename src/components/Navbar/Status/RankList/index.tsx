import { useCharacterProgress } from "@/contexts/CharacterProgressContext";
import { CHARACTERS } from "@/data/options/characters";
import { playerPath } from "@/utils/paths";
import { getRank, getRankIndex, RANKS } from "@/gameRules/rank";
import styles from "./styles.module.css";

export function RankList() {
  const { progress } = useCharacterProgress();
  const chars = CHARACTERS.filter((c) => c.selectable);

  return (
    <div className="containerOfNavbar">
      <h2>Ranques</h2>
      <div className={styles.ranksList}>
        {RANKS.map((rank, index) => {
          const minLevel = index * 10;
          const maxLevel =
            index === RANKS.length - 1 ? "100+" : (index + 1) * 10 - 1;
          const multiplier = 1 + index * 0.1;
          return (
            <div key={String(rank.id)} className={styles.rankRow}>
              <div className={styles.rankInfo}>
                <span className={styles.rankName}>{rank.label}</span>
                <span className={styles.rankLevels}>
                  Nv. {minLevel}–{maxLevel}
                </span>
                <span className={styles.rankBuff}>
                  {multiplier.toFixed(1)}x
                </span>
              </div>
              <div className={styles.rankChars}>
                {chars.map((c) => {
                  const charLevel = progress[c.image]?.level ?? 1;
                  const charRank = getRank(charLevel);
                  if (getRankIndex(charRank) !== index) return null;
                  return (
                    <img
                      key={c.image}
                      src={playerPath(`/${c.image}/face.svg`)}
                      alt={c.name}
                      className={styles.rankCharFace}
                      title={`${c.name} (Nv.${charLevel})`}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
