import { usePlayer } from "@/contexts/PlayerContext";
import { useCharacterProgress } from "@/contexts/CharacterProgressContext";
import { useEquipment } from "@/contexts/EquipmentContext";
import { STATS_MENU_ROWS } from "@/data/player/statEffects";
import { statusIconPath } from "@/utils/paths";
import { SelectedStatEffect } from "./SelectedStatEffect";

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

      {STATS_MENU_ROWS.map((row, index) => {
        const isSelected = selectedIndex === index;
        const value = stats[row.key] ?? 1;
        const rowBonus = row.bonusKey ? bonus[row.bonusKey] : 0;

        return (
            <div
              className={isSelected ? "active" : ""}
              style={isSelected ? { flexWrap: "wrap" } : undefined}
              key={row.key}
            >
              <p>
                <img src={row.icon} />
                {row.label}: {value}
                {rowBonus > 0 ? <span> +{rowBonus}</span> : ""}
              </p>
              {isSelected && <SelectedStatEffect selectedIndex={index} />}
            </div>
        );
      })}
    </div>
  );
}
