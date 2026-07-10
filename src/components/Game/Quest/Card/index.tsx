import styles from "./styles.module.css";
import { asset } from "@/utils/paths";
import { FREQ_LABEL } from "@/data/quests/frequencies";

type Props = {
  quest: Quest;
  selected: boolean;
};

export function QuestCard({ quest, selected }: Props) {
  const isActive = quest.completed && !quest.claimed;

  return (
    <div
      style={{
        background: isActive ? "#2e7d32" : "#1a1a1a",
        border: selected ? "2px solid yellow" : "2px solid transparent",
        opacity: isActive ? 0.8 : 1,
      }}
      className={styles.container}
    >
      <div className={styles.row}>
        <img
          src={quest.image ? asset(quest.image) : ""}
          className={styles.image}
          width={50}
        />
        <div>
          <h3>{quest.name}</h3>
          {quest.frequency && (
            <span className={styles.freqBadge} data-freq={quest.frequency}>
              {FREQ_LABEL[quest.frequency]}
            </span>
          )}
        </div>
      </div>

      <p>{quest.description}</p>
      <div className={styles.rowTwo}>
        <span>
          {quest.progress} / {quest.counter}{" "}
        </span>
        <p>
          {quest.rewards} {quest.rewardsType?.toUpperCase()}
        </p>
      </div>
    </div>
  );
}
