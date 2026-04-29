import type { Quest } from "@/utils/types/player/quest";
import styles from "./styles.module.css";


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
                <img src={quest.image} width={50} />
                <h3>{quest.name}</h3>
            </div>

            <p>{quest.description}</p>
            <div className={styles.rowTwo}>
                <span>{quest.progress} / {quest.counter} </span>
                <p>{quest.rewards} XP</p>
            </div>
        </div>
    );
}