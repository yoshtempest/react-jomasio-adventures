import { usePlayer } from "@/contexts/PlayerContext";
import { useCharacterProgress } from "@/contexts/CharacterProgressContext";
import { useEquipment } from "@/contexts/EquipmentContext";
import { STAT_TIPS } from "@/data/stats/tips";
import styles from "./styles.module.css";
import { asset } from "@/utils/paths";

type AvailableStatsProps = {
  selectedIndex: number;
};

export function AvailableStats({ selectedIndex }: AvailableStatsProps) {
  const { player } = usePlayer();
  const character = player.character;
  const { progress } = useCharacterProgress();
  const { getTotalBonus } = useEquipment();

  const stats = progress[character]?.stats ?? {
    hp: 1,
    strength: 1,
    intelligence: 1,
    resistance: 1,
    tenacity: 1,
    luck: 1,
    points: 0,
  };
  const bonus = getTotalBonus(character);

  return (
    <div className={`StatusColumn ${styles.container}`}>
      <div className="statusMainContainer">
        <img src={asset("/assets/status/disponiblePoints.svg")} />
        <h2 className="StatusTitle">Pontos: {stats.points}</h2>
      </div>
      <div
        className={selectedIndex === 0 ? "active" : ""}
        style={selectedIndex === 0 ? { flexWrap: "wrap" } : undefined}
      >
        <p>
          <img src={asset("/assets/status/hp.svg")} />
          Vida: {stats.hp}
          {bonus.hp > 0 ? <span> +{bonus.hp}</span> : ""}
        </p>
        {selectedIndex === 0 && <p className={styles.tip}>{STAT_TIPS.hp}</p>}
      </div>

      <div
        className={selectedIndex === 1 ? "active" : ""}
        style={selectedIndex === 1 ? { flexWrap: "wrap" } : undefined}
      >
        <p>
          <img src={asset("/assets/status/strenght.svg")} />
          Força: {stats.strength}
          {bonus.strength > 0 ? <span> +{bonus.strength}</span> : ""}
        </p>
        {selectedIndex === 1 && (
          <p className={styles.tip}>{STAT_TIPS.strength}</p>
        )}
      </div>

      <div
        className={selectedIndex === 2 ? "active" : ""}
        style={selectedIndex === 2 ? { flexWrap: "wrap" } : undefined}
      >
        <p>
          <img src={asset("/assets/status/intelligence.svg")} />
          Inteligência: {stats.intelligence}
          {bonus.intelligence > 0 ? <span> +{bonus.intelligence}</span> : ""}
        </p>
        {selectedIndex === 2 && (
          <p className={styles.tip}>{STAT_TIPS.intelligence}</p>
        )}
      </div>

      <div
        className={selectedIndex === 3 ? "active" : ""}
        style={selectedIndex === 3 ? { flexWrap: "wrap" } : undefined}
      >
        <p>
          <img src={asset("/assets/status/armor.svg")} />
          Resistência: {stats.resistance ?? 1}
        </p>
        {selectedIndex === 3 && (
          <p className={styles.tip}>{STAT_TIPS.resistance}</p>
        )}
      </div>

      <div
        className={selectedIndex === 4 ? "active" : ""}
        style={selectedIndex === 4 ? { flexWrap: "wrap" } : undefined}
      >
        <p>
          <img src={asset("/assets/status/tenacity.svg")} />
          Tenacidade: {stats.tenacity ?? 1}
          {bonus.tenacity > 0 ? <span> +{bonus.tenacity}</span> : ""}
        </p>
        {selectedIndex === 4 && (
          <p className={styles.tip}>{STAT_TIPS.tenacity}</p>
        )}
      </div>

      <div
        className={selectedIndex === 5 ? "active" : ""}
        style={selectedIndex === 5 ? { flexWrap: "wrap" } : undefined}
      >
        <p>
          <img src={asset("/assets/status/luckChance.svg")} />
          Sorte: {stats.luck ?? 1}
          {bonus.luck > 0 ? <span> +{bonus.luck}</span> : ""}
        </p>
        {selectedIndex === 5 && <p className={styles.tip}>{STAT_TIPS.luck}</p>}
      </div>

      <div className={selectedIndex === 6 ? "active" : ""}>
        <p className={styles.subBtn}>
          <img src={asset("/assets/status/skills.svg")} />
          Habilidades
        </p>
      </div>

      <div className={selectedIndex === 7 ? "active" : ""}>
        <p className={styles.subBtn}>
          <img src={asset("/assets/status/ranks.svg")} />
          Ranques
        </p>
      </div>
    </div>
  );
}
