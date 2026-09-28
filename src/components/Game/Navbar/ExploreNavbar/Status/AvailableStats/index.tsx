import { usePlayer } from "@/contexts/PlayerContext";
import { useCharacterProgress } from "@/contexts/CharacterProgressContext";
import { useEquipment } from "@/contexts/EquipmentContext";

import { STATUS_SUB_ROWS } from "@/hooks/menu/useStatus";
import { statusIconPath } from "@/utils/paths";

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
        <img src={statusIconPath("disponiblePoints.svg")} />
        <h2 className="StatusTitle">Pontos: {stats.points}</h2>
      </div>
      <div
        className={selectedIndex === 0 ? "active" : ""}
        style={selectedIndex === 0 ? { flexWrap: "wrap" } : undefined}
      >
        <p>
          <img src={statusIconPath("hp.svg")} />
          Vida: {stats.hp}
          {bonus.hp > 0 ? <span> +{bonus.hp}</span> : ""}
        </p>
      </div>

      <div
        className={selectedIndex === 1 ? "active" : ""}
        style={selectedIndex === 1 ? { flexWrap: "wrap" } : undefined}
      >
        <p>
          <img src={statusIconPath("strenght.svg")} />
          Força: {stats.strength}
          {bonus.strength > 0 ? <span> +{bonus.strength}</span> : ""}
        </p>
      </div>

      <div
        className={selectedIndex === 2 ? "active" : ""}
        style={selectedIndex === 2 ? { flexWrap: "wrap" } : undefined}
      >
        <p>
          <img src={statusIconPath("intelligence.svg")} />
          Inteligência: {stats.intelligence}
          {bonus.intelligence > 0 ? <span> +{bonus.intelligence}</span> : ""}
        </p>
      </div>

      <div
        className={selectedIndex === 3 ? "active" : ""}
        style={selectedIndex === 3 ? { flexWrap: "wrap" } : undefined}
      >
        <p>
          <img src={statusIconPath("armor.svg")} />
          Resistência: {stats.resistance ?? 1}
        </p>
      </div>

      <div
        className={selectedIndex === 4 ? "active" : ""}
        style={selectedIndex === 4 ? { flexWrap: "wrap" } : undefined}
      >
        <p>
          <img src={statusIconPath("luckChance.svg")} />
          Sorte: {stats.luck ?? 1}
          {bonus.luck > 0 ? <span> +{bonus.luck}</span> : ""}
        </p>
      </div>

      {STATUS_SUB_ROWS.map((row) => (
        <div
          key={row.view}
          className={selectedIndex === row.index ? "active" : ""}
        >
          <p className={styles.subBtn}>
            <img src={row.icon} />
            {row.label}
          </p>
        </div>
      ))}
    </div>
  );
}
