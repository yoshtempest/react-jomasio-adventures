import { getBossSizeMultiplier } from "@/utils/npc/getSpritePath";
import { findDamageTarget } from "@/utils/battle/findDamageTarget";
import type { ReplayFrame } from "@/utils/types/replay";
import styles from "./styles.module.css";

type Props = {
  damage: ReplayFrame["dmg"];
  frame: ReplayFrame;
  npcType: string;
  layout: { TILE: number; PLAYER: number };
};

const HEAD_GAP = 4;

export function ReplayDamageNumbers({ damage, frame, npcType, layout }: Props) {
  const targets = [
    { x: frame.px, y: frame.py, h: layout.PLAYER },
    {
      x: frame.nx,
      y: frame.ny,
      h: layout.TILE * getBossSizeMultiplier(npcType, frame.npcPhase),
    },
    ...(frame.petx != null && frame.pety != null
      ? [{ x: frame.petx, y: frame.pety, h: layout.TILE * 0.8 }]
      : []),
    ...frame.sm.map((s) => ({ x: s.x, y: s.y, h: layout.TILE })),
  ];

  return (
    <>
      {damage.map((d, index) => {
        const target = findDamageTarget(d.x, d.y, targets);
        const headOffset = target ? target.h + HEAD_GAP : 80;
        return (
          <div
            key={index}
            className={`${styles.dmgNum} ${d.c ? styles.dmgCrit : ""}${d.ty === "miss" ? styles.dmgMiss : ""} ${d.ty === "blocked" ? styles.dmgBlocked : ""} ${d.ty === "parry" ? styles.dmgParry : ""}`}
            style={{
              left: d.x,
              top: d.y - headOffset,
              zIndex: 100,
            }}
          >
            {d.ty === "blocked"
              ? "BLOCKED!"
              : d.ty === "parry"
                ? "PARRY!"
                : d.ty === "miss"
                  ? "MISS!"
                  : d.c
                    ? (
                        <span className={styles.critText}>
                          {`CRIT -${d.v}`}
                        </span>
                      )
                    : d.v > 0
                      ? `-${d.v}`
                      : "0"}
          </div>
        );
      })}
    </>
  );
}
