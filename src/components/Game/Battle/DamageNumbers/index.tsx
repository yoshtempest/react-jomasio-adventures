import styles from "./styles.module.css";
import type { DamageNumber } from "@/hooks/battle/damage/useNumbers";

type Props = {
  numbers: DamageNumber[];
  scaleX: number;
  scaleY: number;
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
  miss: styles.miss,
};

export function DamageNumbers({ numbers, scaleX, scaleY }: Props) {
  return (
    <>
      {numbers.map((n) => (
        <div
          key={n.id}
          className={`${styles.number} ${TYPE_CLASS[n.type] ?? styles.npc}`}
          style={{
            left: n.x * scaleX,
            top: n.y * scaleY - 80,
          }}
        >
          {n.type === "blocked"
            ? "BLOCKED!"
            : n.type === "miss"
              ? "MISS!"
              : n.value > 0
                ? `-${n.value}`
                : "0"}
        </div>
      ))}
    </>
  );
}
