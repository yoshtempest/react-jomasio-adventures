import { useQuests } from "@/contexts/QuestContext";
import { useQuestMenu, type QuestTab } from "@/hooks/menu/useQuestMenu";
import styles from "./styles.module.css";
import { QuestCard } from "@/components/QuestCard";
import { useRef } from "react";

const TAB_LABELS: Record<QuestTab, string> = {
  active: "Em andamento",
  completed: "Concluídas",
  daily: "Diárias",
  weekly: "Semanais",
};

const TAB_KEYS: QuestTab[] = ["active", "completed", "daily", "weekly"];

function getEmptyMessage(tab: QuestTab): string {
  switch (tab) {
    case "active":
      return "Nenhuma missão em andamento.";
    case "completed":
      return "Nenhuma missão concluída.";
    case "daily":
      return "Nenhuma missão diária disponível.";
    case "weekly":
      return "Nenhuma missão semanal disponível.";
  }
}

export function Mission() {
  const { quests } = useQuests();
  const listRef = useRef<HTMLUListElement>(null);

  const {
    selectedIndex,
    activeTab,
    activeQuests,
    completedQuests,
    dailyQuests,
    weeklyQuests,
    visibleQuests,
    switchTab,
  } = useQuestMenu(true, quests, listRef);

  const tabCountMap: Record<QuestTab, number> = {
    active: activeQuests.length,
    completed: completedQuests.length,
    daily: dailyQuests.length,
    weekly: weeklyQuests.length,
  };

  return (
    <div className="containerOfNavbar">
      <h3>Missões</h3>

      <div className={styles.tabs}>
        {TAB_KEYS.map((key, i) => (
          <button
            key={key}
            className={`${styles.tab} ${activeTab === key ? styles.tabActive : ""} ${selectedIndex === i ? styles.tabSelected : ""}`}
            onClick={() => switchTab(key)}
          >
            {TAB_LABELS[key]} ({tabCountMap[key]})
          </button>
        ))}
      </div>

      {visibleQuests.length === 0 ? (
        <p className={styles.empty}>{getEmptyMessage(activeTab)}</p>
      ) : (
        <ul className={styles.ul} ref={listRef}>
          {visibleQuests.map((q, index) => (
            <QuestCard
              key={q.id}
              quest={q}
              selected={index === selectedIndex - TAB_KEYS.length}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
