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
  projectile: styles.projectile!,
  blocked: styles.blocked!,
  parry: styles.parry!,
  reflect: styles.reflect!,
  crit: styles.crit!,
  charge: styles.charge!,
  miss: styles.miss!,
  burn: styles.burn!,
  poison: styles.poison!,
  freeze: styles.freeze!,
  confuse: styles.confuse!,
  armor: styles.armor!,
  heal: styles.heal!,
};

const HEAD_GAP = 8;
/** Tipos que não pertencem a um personagem: ficam no ponto do projétil. */
const NO_SNAP_TYPES = new Set<string>(["projectile"]);
const NO_SNAP_OFFSET = 20;

export function DamageNumbers({ numbers, scaleX, scaleY, targets }: Props) {
  return (
    <>
      {numbers.map((n) => {
        const noSnap = NO_SNAP_TYPES.has(n.type);
        const target = noSnap
          ? undefined
          : findDamageTarget(n.x, n.y, targets);
        const headOffset = noSnap
          ? NO_SNAP_OFFSET
          : target
            ? target.h + HEAD_GAP
            : 80;
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
            {n.type === "crit" ? (
              <div className={styles.critBackground}>
                <span className={styles.critText}>
                  {n.value > 0 ? `-${n.value}` : "0"}
                </span>
              </div>
            ) : n.type === "blocked" ? (
              "BLOCKED!"
            ) : n.type === "parry" ? (
              "PARRY!"
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
