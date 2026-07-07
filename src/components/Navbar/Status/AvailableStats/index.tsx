import { usePlayer } from "@/contexts/PlayerContext";
import { useCharacterProgress } from "@/contexts/CharacterProgressContext";
import { useEquipment } from "@/contexts/EquipmentContext";
import { STAT_TIPS } from "@/data/stats/tips";
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

  return (
    <div className="StatusColumn" style={{ width: "14vw" }}>
      <h2 className="StatusTitle">Pontos disponíveis: {stats.points}</h2>
        <div
          className={selectedIndex === 0 ? "active" : ""}
          style={selectedIndex === 0 ? { flexWrap: "wrap" } : undefined}
        >
          <p>
            Vida: {stats.hp}
            {bonus.hp > 0 ? <span> +{bonus.hp}</span> : ""}
          </p>
          {selectedIndex === 0 && <p className={styles.tip}>{STAT_TIPS.hp}</p>}
        </div>

        <div
          className={selectedIndex === 1 ? "active" : ""}
          style={selectedIndex === 1 ? { flexWrap: "wrap"} : undefined}
        >
          <p>
            Força: {stats.strength}
            {bonus.strength > 0 ? <span> +{bonus.strength}</span> : ""}
          </p>
          {selectedIndex === 1 && <p className={styles.tip}>{STAT_TIPS.strength}</p>}
        </div>

        <div
          className={selectedIndex === 2 ? "active" : ""}
          style={selectedIndex === 2 ? { flexWrap: "wrap" } : undefined}
        >
          <p>
            Inteligência: {stats.intelligence}
            {bonus.intelligence > 0 ? (
              <span> +{bonus.intelligence}</span>
            ) : (
              ""
            )}
          </p>
          {selectedIndex === 2 && <p className={styles.tip}>{STAT_TIPS.intelligence}</p>}
        </div>

        <div
          className={selectedIndex === 3 ? "active" : ""}
          style={selectedIndex === 3 ? { flexWrap: "wrap" } : undefined}
        >
          <p>
            Resistência: {stats.resistance ?? 1}
          </p>
          {selectedIndex === 3 && <p className={styles.tip}>{STAT_TIPS.resistance}</p>}
        </div>

        <div className={selectedIndex === 4 ? "active" : ""}>
          <p className={styles.subBtn}>Habilidades</p>
        </div>

        <div className={selectedIndex === 5 ? "active" : ""}>
          <p className={styles.subBtn}>Ranques</p>
        </div>

    </div>
  );
}
