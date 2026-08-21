import styles from "./styles.module.css";
import type { DamageNumber } from "@/hooks/battle/damage/useNumbers";
import type { DamageTarget } from "@/utils/battle/findDamageTarget";
import { findDamageTarget } from "@/utils/battle/findDamageTarget";
import { asset } from "@/utils/paths";

export type { DamageTarget } from "@/utils/battle/findDamageTarget";

type Props = {
  numbers: DamageNumber[];
  scaleX: number;
  scaleY: number;
  targets: DamageTarget[];
};

const TYPE_CLASS: Record<string, string> = {
  player: styles.player!,
  npc: styles.npc!,
  special: styles.special!,
  pet: styles.pet!,
  summon: styles.summon!,
  blocked: styles.blocked!,
  crit: styles.crit!,
  charge: styles.charge!,
  miss: styles.miss!,
  burn: styles.burn!,
  poison: styles.poison!,
  confuse: styles.confuse!,
  armor: styles.armor!,
  heal: styles.heal!,
};

const HEAD_GAP = 8;

export function DamageNumbers({ numbers, scaleX, scaleY, targets }: Props) {
  return (
    <>
      {numbers.map((n) => {
        const target = findDamageTarget(n.x, n.y, targets);
        const headOffset = target ? target.h + HEAD_GAP : 80;
        return (
          <div
            key={n.id}
            className={`${styles.number} ${TYPE_CLASS[n.type] ?? styles.npc}`}
            style={{
              left: n.x * scaleX,
              top: n.y * scaleY - headOffset,
              translate: "-50% 0",
            }}
          >
            {n.type === "blocked" ? (
              "BLOCKED!"
            ) : n.type === "miss" ? (
              "MISS!"
            ) : n.type === "heal" ? (
              `+${n.value}`
            ) : n.type === "armor" ? (
              <>
                <img
                  src={asset("/assets/badges/titles/blockAttacks.svg")}
                  className={styles.image}
                />
                +1
              </>
            ) : n.value > 0 ? (
              `-${n.value}`
            ) : (
              "0"
            )}
          </div>
        );
      })}
    </>
  );
}
