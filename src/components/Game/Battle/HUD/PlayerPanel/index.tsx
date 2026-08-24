import { HealthBar } from "@/components/Game/Battle/HUD/HealthBar";
import { Deliciometro } from "@/components/Game/Battle/HUD/Deliciometro";
import { BlockGauge } from "@/components/Game/Battle/HUD/BlockGauge";
import { ElementBadges } from "@/components/Game/Battle/HUD/ElementBadges";
import { playerPath } from "@/utils/paths";
import type { ElementType } from "@/utils/types/battle/element";
import styles from "../styles.module.css";
import { asset } from "@/utils/paths";

type Props = {
  character: string;
  playerName: string;
  playerRank: string;
  playerElementTypes?: readonly ElementType[];
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
  playerElementTypes,
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
      <div>
        <img
          src={playerPath(`/${character}/face.svg`)}
          alt="Player HUD"
          className="hudImage"
          
        />
        <img
          src={asset(`/assets/badges/ranks/${playerRank}`)}
          className={`${styles.rankBadge} ${styles.playerRankBadge}`}
        />
      </div>
      <div className={styles.playerInfo}>
        <div className={styles.nameRow}>
          <h2 className={`${"hudName"} ${styles.playerName}`}>{playerName}</h2>
          {playerElementTypes && <ElementBadges types={playerElementTypes} />}
        </div>


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
