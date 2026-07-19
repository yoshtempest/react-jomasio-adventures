import { HealthBar } from "@/components/Game/Battle/HUD/HealthBar";
import { Deliciometro } from "@/components/Game/Battle/HUD/Deliciometro";
import { BlockGauge } from "@/components/Game/Battle/HUD/BlockGauge";
import { playerPath } from "@/utils/paths";
import styles from "../styles.module.css";

type Props = {
  character: string;
  playerName: string;
  playerRank: string;
  hp: number;
  maxHp: number;
  shield: number;
  delicia: number;
  hitsToSpecial: number;
  blockGauge: number;
  blockLimit: number;
  petHP?: number;
  petMaxHp?: number;
};

export function PlayerHUDPanel({
  character,
  playerName,
  playerRank,
  hp,
  maxHp,
  shield,
  delicia,
  hitsToSpecial,
  blockGauge,
  blockLimit,
  petHP,
  petMaxHp,
}: Props) {
  return (
    <div className={styles.container} style={{ left: 10, top: 10 }}>
      <img
        src={playerPath(`/${character}/face.svg`)}
        alt="Player HUD"
        className={styles.image}
      />
      <div className={styles.playerInfo}>
        <h2 className={styles.playerName}>{playerName}</h2>
        <p className={styles.playerRank}>{playerRank}</p>

        <div className={styles.flexRow}>
          <div>
            <HealthBar hp={hp} maxHp={maxHp} />
            {shield > 0 && (
              <div className={styles.shieldTrack}>
                <div
                  className={styles.shieldFill}
                  style={{
                    width: `${Math.min(100, (shield / maxHp) * 100)}%`,
                  }}
                />
              </div>
            )}
            <BlockGauge blockGauge={blockGauge} blockLimit={blockLimit} />
            {petHP !== undefined && petMaxHp !== undefined && (
              <div className={styles.petTrack}>
                <span className={styles.petLabel}>Pet</span>
                <div
                  className={styles.petFill}
                  style={{
                    width: `${(petHP / petMaxHp) * 100}%`,
                  }}
                />
                <span className={styles.petText}>
                  {petHP}/{petMaxHp}
                </span>
              </div>
            )}
          </div>
          <Deliciometro delicia={delicia} hitsToSpecial={hitsToSpecial} />
        </div>
      </div>
    </div>
  );
}
