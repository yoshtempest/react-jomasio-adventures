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
}: Props) {
  return (
    <div className={styles.container} style={{ left: 10, top: 10 }}>
      <img
        src={playerPath(`/${character}/face.svg`)}
        alt="Player HUD"
        className="hudImage"
      />
      <div className={styles.playerInfo}>
        <h2 className={`${"hudName"} ${styles.playerName}`}>{playerName}</h2>
        <p className={`${"hudRank"} ${styles.playerRank}`}>{playerRank}</p>

        <div className="hudFlexRow">
          <div>
            <HealthBar hp={hp} maxHp={maxHp} />
            {shield > 0 && (
              <div className="shieldTrack">
                <div
                  className="shieldFill"
                  style={{
                    width: `${Math.min(100, (shield / maxHp) * 100)}%`,
                  }}
                />
              </div>
            )}
            <BlockGauge blockGauge={blockGauge} blockLimit={blockLimit} />
          </div>
          <Deliciometro delicia={delicia} hitsToSpecial={hitsToSpecial} />
        </div>
      </div>
    </div>
  );
}
