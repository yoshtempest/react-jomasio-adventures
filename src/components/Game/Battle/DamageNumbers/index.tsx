import styles from "./styles.module.css";
import type { DamageNumber } from "@/hooks/battle/damage/useNumbers";

type Props = {
  numbers: DamageNumber[];
};

const TYPE_CLASS: Record<string, string> = {
  player: styles.player,
  npc: styles.npc,
  special: styles.special,
  pet: styles.pet,
  summon: styles.summon,
  blocked: styles.blocked,
  crit: styles.crit,
  charge: styles.charge,
};

export function DamageNumbers({ numbers }: Props) {
  return (
    <>
      {numbers.map((n) => (
        <div
          key={n.id}
          className={`${styles.number} ${TYPE_CLASS[n.type] ?? styles.npc}`}
          style={{
            left: n.x,
            top: n.y - 40,
          }}
        >
          {n.type === "blocked"
            ? "BLOCKED!"
            : n.value > 0
              ? `-${n.value}`
              : "0"}
        </div>
      ))}
    </>
  );
}
