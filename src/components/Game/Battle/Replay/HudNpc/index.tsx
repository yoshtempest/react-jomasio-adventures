import styles from "./styles.module.css";

type Props = {
  npcType: string;
  npcLevel: number;
  nhp: number;
  nmaxhp: number;
};

export function HudNpc({ npcType, npcLevel, nhp, nmaxhp }: Props) {
  const hpPct = nmaxhp > 0 ? Math.max(0, Math.min(100, (nhp / nmaxhp) * 100)) : 0;
  const hpColor = hpPct > 70 ? "limegreen" : hpPct > 30 ? "orange" : "red";

  return (
    <div className={styles.hudNpc}>
      <span className={styles.npcName}>
        {npcType} — nv.{npcLevel}
      </span>
      <div className={styles.hudBarOuter}>
        <div
          className={styles.hudBarFill}
          style={{
            width: `${hpPct}%`,
            background: hpColor,
            marginLeft: `${100 - hpPct}%`,
          }}
        />
        <span className={styles.hudBarText}>
          {Math.round(nhp)} / {nmaxhp}
        </span>
      </div>
    </div>
  );
}
