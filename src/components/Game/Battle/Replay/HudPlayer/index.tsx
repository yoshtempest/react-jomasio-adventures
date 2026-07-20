import { Deliciometro } from "@/components/Game/Battle/HUD/Deliciometro";
import styles from "./styles.module.css";

type Props = {
  php: number;
  pmaxhp: number;
  pshield: number;
  del: number;
  hits: number;
  pettype: string | null;
  petphp: number | null;
  petpmaxhp: number | null;
};

export function HudPlayer({ php, pmaxhp, pshield, del, hits, pettype, petphp, petpmaxhp }: Props) {
  const hpPct = pmaxhp > 0 ? Math.max(0, Math.min(100, (php / pmaxhp) * 100)) : 0;
  const hpColor = hpPct > 70 ? "limegreen" : hpPct > 30 ? "orange" : "red";
  const playerName = localStorage.getItem("playerName") || "Protagonista";

  return (
    <div className={styles.hudPlayer}>
      <span className={styles.playerName}>{playerName}</span>
      <div className={styles.hudRow}>
        <div className={styles.hudBarOuter}>
          <div className={styles.hudBarFill} style={{ width: `${hpPct}%`, background: hpColor }} />
          <span className={styles.hudBarText}>{Math.round(php)} / {pmaxhp}</span>
        </div>
      </div>
      {pshield > 0 && (
        <div className={styles.shieldTrack}>
          <div className={styles.shieldFill} style={{ width: `${Math.min(100, (pshield / 100) * 100)}%` }} />
        </div>
      )}
      <Deliciometro delicia={del} hitsToSpecial={hits} />
      {pettype && petphp != null && petpmaxhp != null && (
        <div className={styles.hudRow}>
          <span className={styles.hudLabel}>Pet</span>
          <div className={styles.hudBarOuter}>
            <div
              className={styles.hudBarFill}
              style={{
                width: `${petpmaxhp > 0 ? (petphp / petpmaxhp) * 100 : 0}%`,
                background: "#44ff44",
              }}
            />
            <span className={styles.hudBarText}>
              {Math.round(petphp)} / {petpmaxhp}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
