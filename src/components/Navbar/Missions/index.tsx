import { useQuests } from "@/contexts/QuestContext";
import { useQuestMenu } from "@/hooks/menu/useQuestMenu";
import styles from "./styles.module.css";
import { QuestCard } from "@/components/QuestCard";
import { useRef } from "react";

export function Mission() {
  const { quests } = useQuests();
  const listRef = useRef<HTMLUListElement>(null);

  const {
    selectedIndex,
    activeTab,
    activeQuests,
    completedQuests,
    visibleQuests,
    switchTab,
  } = useQuestMenu(true, quests, listRef);

  return (
    <div className="containerOfNavbar">
      <h3>Missões</h3>

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === "active" ? styles.tabActive : ""} ${selectedIndex === 0 ? styles.tabSelected : ""}`}
          onClick={() => switchTab("active")}
        >
          Em andamento ({activeQuests.length})
        </button>
        <button
          className={`${styles.tab} ${activeTab === "completed" ? styles.tabActive : ""} ${selectedIndex === 1 ? styles.tabSelected : ""}`}
          onClick={() => switchTab("completed")}
        >
          Concluídas ({completedQuests.length})
        </button>
      </div>

      {visibleQuests.length === 0 ? (
        <p className={styles.empty}>
          {activeTab === "active"
            ? "Nenhuma missão em andamento."
            : "Nenhuma missão concluída."}
        </p>
      ) : (
        <ul className={styles.ul} ref={listRef}>
          {visibleQuests.map((q, index) => (
            <QuestCard
              key={q.id}
              quest={q}
              selected={index === selectedIndex - 2}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
