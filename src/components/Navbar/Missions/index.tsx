import { useQuests } from "@/contexts/QuestContext";
import { useQuestMenu } from "@/hooks/menu/useQuestMenu";
import styles from "./styles.module.css";
import { QuestCard } from "@/components/QuestCard";

export function Mission() {
  const { quests } = useQuests();
  const { selectedIndex } = useQuestMenu(true);

  return (
    <div className={styles.inventory}>
      <h3>Missões</h3>

      <ul>
        {quests.map((q, index) => (
          <QuestCard
            key={q.id}
            quest={q}
            selected={index === selectedIndex}
          />
        ))}
      </ul>
    </div>
  );
}