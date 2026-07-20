import { formatDuration } from "@/utils/formatDuration";
import styles from "./styles.module.css";

type Props = {
  npcType: string;
  npcLevel: number;
  currentTime: number;
  duration: number;
};

export function ReplayHeader({ npcType, npcLevel, currentTime, duration }: Props) {
  return (
    <div className={styles.header}>
      <span className={styles.title}>
        Replay — {npcType} nv.{npcLevel}
      </span>
      <span className={styles.time}>
        {formatDuration(currentTime)} / {formatDuration(duration)}
      </span>
    </div>
  );
}
