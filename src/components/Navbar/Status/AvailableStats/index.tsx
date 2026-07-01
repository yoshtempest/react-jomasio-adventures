import { usePlayer } from "@/contexts/PlayerContext";
import { useCharacterProgress } from "@/contexts/CharacterProgressContext";
import { useEquipment } from "@/contexts/EquipmentContext";
import { STAT_TIPS } from "@/data/stats/tips";
import { STATS } from "@/utils/types/player/stats";
import styles from "./styles.module.css";

type AvailableStatsProps = {
  selectedIndex: number;
};

export function AvailableStats({ selectedIndex }: AvailableStatsProps) {
  const { player } = usePlayer();
  const character = player.character;
  const { progress } = useCharacterProgress();
  const { getTotalBonus } = useEquipment();

  const stats = progress[character]?.stats ?? {
    hp: 1, strength: 1, intelligence: 1, resistance: 1, points: 0,
  };
  const bonus = getTotalBonus(character);

  const OPTIONS = STATS;
  const selectedStat = selectedIndex < OPTIONS.length ? OPTIONS[selectedIndex] : null;

  return (
    <div className="StatusColumn" style={{ width: "14vw" }}>
      <h2 className="StatusTitle">Pontos disponíveis: {stats.points}</h2>
        <div className={selectedIndex === 0 ? "active" : ""}>
          <p>
            Vida: {stats.hp}
            {bonus.hp > 0 ? <span> +{bonus.hp}</span> : ""}
          </p>
        </div>

        <div className={selectedIndex === 1 ? "active" : ""}>
          <p>
            Força: {stats.strength}
            {bonus.strength > 0 ? <span> +{bonus.strength}</span> : ""}
          </p>
        </div>

        <div className={selectedIndex === 2 ? "active" : ""}>
          <p>
            Inteligência: {stats.intelligence}
            {bonus.intelligence > 0 ? (
              <span> +{bonus.intelligence}</span>
            ) : (
              ""
            )}
          </p>
        </div>

        <div className={selectedIndex === 3 ? "active" : ""}>
          <p>
            Resistência: {stats.resistance ?? 1}
          </p>
        </div>

        <div className={selectedIndex === 4 ? "active" : ""}>
          <p className={styles.subBtn}>Árvore de habilidades</p>
        </div>

        <div className={selectedIndex === 5 ? "active" : ""}>
          <p className={styles.subBtn}>Ver ranques</p>
        </div>

        {selectedStat && STAT_TIPS[selectedStat] && (
          <p className={styles.tip}>{STAT_TIPS[selectedStat]}</p>
        )}
    </div>
  );
}
