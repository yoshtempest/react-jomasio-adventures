import { useQuests } from "@/contexts/QuestContext";
import { useQuestMenu } from "@/hooks/menu/useQuestMenu";
import styles from "./styles.module.css";
import { QuestCard } from "@/components/QuestCard";
import { useRef } from "react";

export function Mission() {
  const { quests } = useQuests();
  const listRef = useRef<HTMLUListElement>(null);
  const { selectedIndex } = useQuestMenu(true, listRef);

  return (
    <div className="containerOfNavbar">
      <h3>Missões</h3>

      <ul className={styles.ul} ref={listRef}>
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