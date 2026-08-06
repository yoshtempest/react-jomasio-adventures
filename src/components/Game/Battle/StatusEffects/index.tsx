import { useEffect, useState } from "react";
import styles from "./styles.module.css";
import { Droplets, Flame, Skull, Zap, EyeOff, Brain, Snowflake } from "lucide-react";
import { usePlayer } from "@/contexts/PlayerContext";
import {
  getActivePlayerStatuses,
  type PlayerStatus,
} from "@/gameRules/battle/status/statusEffects";

type StatusMeta = {
  Icon: typeof Droplets;
  color: string;
  filled?: boolean;
};

const STATUS_META: Record<PlayerStatus, StatusMeta> = {
  bleed: { Icon: Droplets, color: "#ff4444", filled: true },
  burn: { Icon: Flame, color: "#ff8800", filled: true },
  poison: { Icon: Skull, color: "#44ff44", filled: true },
  paralyze: { Icon: Zap, color: "#ffdd00" },
  blind: { Icon: EyeOff, color: "#aaaaaa" },
  confuse: { Icon: Brain, color: "#c084fc" },
  freeze: { Icon: Snowflake, color: "#7dd3fc" },
};

export function StatusEffects() {
  const { player } = usePlayer();
  const [, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 500);
    return () => clearInterval(id);
  }, []);

  const statuses = getActivePlayerStatuses(player);

  if (statuses.length === 0) return null;

  return (
    <div className={styles.container}>
      {statuses.map(({ status, remaining }) => {
        const { Icon, color, filled } = STATUS_META[status];
        const seconds = Math.max(1, Math.ceil(remaining / 1000));
        return (
          <div key={status} className={styles.status}>
            <Icon fill={filled ? color : "none"} color={color} size={24} />
            <span>{seconds}s</span>
          </div>
        );
      })}
    </div>
  );
}
