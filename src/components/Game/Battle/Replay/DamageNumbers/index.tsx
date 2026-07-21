

import type { ReplayFrame } from "@/utils/types/replay";
import styles from "../styles.module.css"

type Props = {
  damage: ReplayFrame["dmg"];
};

export function ReplayDamageNumbers({
  damage,
}: Props) {
  return (
    <>
      {damage.map((d, index) => (
        <div
          key={index}
          className={`${styles.dmgNum} ${d.c ? styles.dmgCrit : ""} ${d.ty === "miss" ? styles.dmgMiss : ""} ${d.ty === "blocked" ? styles.dmgBlocked : ""}`}
          style={{
            left: d.x,
            top: d.y - 80,
            zIndex: 100,
          }}
        >
        {d.ty === "blocked"
            ? "BLOCKED!"
            : d.ty === "miss"
            ? "MISS!"
            : d.c
                ? `CRIT -${d.v}`
                : d.v > 0
                ? `-${d.v}`
                : "0"}
        </div>
      ))}
    </>
  );
}