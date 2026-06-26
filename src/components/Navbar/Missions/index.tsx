import { useQuests } from "@/contexts/QuestContext";
import { useQuestMenu, type QuestTab } from "@/hooks/menu/quest/useQuestMenu";
import styles from "./styles.module.css";
import { QuestCard } from "@/components/Game/Quest/Card";
import { useEffect, useRef, useState } from "react";
import {
  getTimeUntilMidnight,
  getTimeUntilMonday,
} from "@/utils/quest/questTimer";
import { TAB_LABELS, TAB_KEYS, getEmptyMessage } from "@/data/quests/tabs";

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

  const [dailyTimer, setDailyTimer] = useState(getTimeUntilMidnight());
  const [weeklyTimer, setWeeklyTimer] = useState(getTimeUntilMonday());

  useEffect(() => {
    const interval = setInterval(() => {
      setDailyTimer(getTimeUntilMidnight());
      setWeeklyTimer(getTimeUntilMonday());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const tabCountMap: Record<QuestTab, number> = {
    active: activeQuests.length,
    completed: completedQuests.length,
    daily: dailyQuests.length,
    weekly: weeklyQuests.length,
  };

  return (
    <div className="containerOfNavbar">
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

      {(activeTab === "daily" || activeTab === "weekly") && (
        <div className={styles.timerBar}>
          {activeTab === "daily" && (
            <span>Reset em: <strong>{dailyTimer}</strong></span>
          )}
          {activeTab === "weekly" && (
            <span>Reset em: <strong>{weeklyTimer}</strong></span>
          )}
        </div>
      )}

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
