import { HealthBar } from "@/components/Game/Battle/HUD/HealthBar";
import { Deliciometro } from "@/components/Game/Battle/HUD/Deliciometro";
import { BlockGauge } from "@/components/Game/Battle/HUD/BlockGauge";
import { playerPath } from "@/utils/paths";
import styles from "./styles.module.css";

type Props = {
  pchar: string;
  php: number;
  pmaxhp: number;
  pshield: number;
  del: number;
  hits: number;
  blockGauge: number;
  blockLimit: number;
  pettype: string | null;
  petphp: number | null;
  petpmaxhp: number | null;
};

export function HudPlayer({
  pchar,
  php,
  pmaxhp,
  pshield,
  del,
  hits,
  blockGauge,
  blockLimit,
  pettype,
  petphp,
  petpmaxhp,
}: Props) {
  const playerName = localStorage.getItem("playerName") || "Protagonista";

  return (
    <div className={styles.container}>
      <img
        src={playerPath(`/${pchar}/face.svg`)}
        alt="Player HUD"
        className="hudImage"
      />
      <div className={styles.info}>
        <h2 className={`${"hudName"} ${styles.name}`}>{playerName}</h2>
        <div className="hudFlexRow">
          <div>
            <HealthBar hp={php} maxHp={pmaxhp} />
            {pshield > 0 && (
              <div className="shieldTrack">
                <div
                  className="shieldFill"
                  style={{
                    width: `${Math.min(100, (pshield / pmaxhp) * 100)}%`,
                  }}
                />
              </div>
            )}
            <BlockGauge blockGauge={blockGauge} blockLimit={blockLimit} />
            {pettype && petphp != null && petpmaxhp != null && (
              <div className="petTrack">
                <span className="petLabel">Pet</span>
                <div
                  className="petFill"
                  style={{
                    width: `${petpmaxhp > 0 ? (petphp / petpmaxhp) * 100 : 0}%`,
                  }}
                />
                <span className="petText">
                  {Math.round(petphp)}/{petpmaxhp}
                </span>
              </div>
            )}
          </div>
          <Deliciometro delicia={del} hitsToSpecial={hits} />
        </div>
      </div>
    </div>
  );
}
