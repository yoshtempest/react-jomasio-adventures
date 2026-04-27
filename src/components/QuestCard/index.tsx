import type { Quest } from "@/utils/types/player/quest";


type Props = {
  quest: Quest;
  selected: boolean;
};

export function QuestCard({ quest, selected }: Props) {

    return (
        <div
            style={{
                background: quest.completed ? "#2e7d32" : "#1a1a1a",
                border: selected ? "2px solid yellow" : "2px solid transparent",
                opacity: quest.completed ? 0.8 : 1,
                padding: "10px",
                marginBottom: "10px",
                transition: "0.2s",
                borderRadius: "4px"
            }}
        >
            <img src={quest.image} width={50} />

            <h3>{quest.name}</h3>
            <p>{quest.description}</p>

            <span>
                {quest.progress} / {quest.counter}
            </span>
        </div>
    );
}